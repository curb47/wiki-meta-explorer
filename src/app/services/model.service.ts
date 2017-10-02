import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs/Rx';
import { BaseDataService, Response, Request } from './data.service';
import { Project } from '../model/project';
import { Page } from '../model/page';

import * as uuid from 'uuid';

/**
 * ModelService provides the data model for this application. Rather than passing
 * state around through UI binding, we hold data model state here.
 */
@Injectable()
export class ModelService {

  private static PROJECTS_LIST: string = 'project.list';
  private static PROJECT_UPDATE: string = 'project.update';
  private static PROJECT_SUBSCRIBE: string = 'project.subscribe';
  private static PROJECT_UNSUBSCRIBE: string = 'project.unsubscribe';
  
  private static PAGES_LIST: string = 'page.list';
  private static PAGE_QUERY: string = 'page.query';
  private static PAGE_UPDATE: string = 'page.update';
  private static PAGE_SUBSCRIBE: string = 'page.subscribe';
  private static PAGE_UNSUBSCRIBE: string = 'page.unsubscribe';

  constructor(private dataService: BaseDataService) {
    this.init();
  }
  
  private init(): void {
    // Setup our received message observer
    this.dataService.getReceivedMessages$().subscribe(response => this._handleMessage(response));
  }


  ////////////////////////////
  // APPLICATION MODEL STATE
  ////////////////////////////
  private _selectedProject: Project;
  /**
   * The currently selected Project
   */
  public get selectedProject() {
    return this._selectedProject;
  }
  public set selectedProject(project: Project) {
    if (this._selectedProject != project) {
      this._selectedProject = project;
      this.selectedPage = null;
    }
  }

  private _selectedPage: Page;
  /**
   * The currently selected Page
   */
  public get selectedPage() {
    return this._selectedPage;
  }
  public set selectedPage(page: Page) {
    this._selectedPage = page;
  }
  

  ////////////////////////////
  // PROJECTS
  ////////////////////////////
  /**
   * Observable that updates whenever the list of Projects is updated
   */
  public getProjects$(): Subject<Project[]> {
    if (!this._projects$) {
      this._projects$ = new BehaviorSubject<Project[]>([]);
      this._requestProjectsList();
    }
    
    return this._projects$;
  }
  private _projects$: Subject<Project[]> = null;

  private _requestProjectsList(): void {
    this._sendRequest(new Request(uuid.v4(), ModelService.PROJECTS_LIST));
  }

  private _handleProjectListResponse(response: Response): void {
    // Validate data in response
    if (!response || !response.data || !(response.data instanceof Array)) {
      return;
    }

    if (this._projects$) {
      // We only need to parse this list if someone is listening to the Projects list
      (this._projects$ as BehaviorSubject<Project[]>).next(response.data.map(projectName => new Project(projectName)));
    }
  }


  /**
   * An array of Observables, where each Observable updates every time the 
   * corresponding project's list of Pages is updated.
   * 
   * TODO: Implement some sort of timeout method for each Observable so that we
   *  don't end up holding ALL Project Pages in memory at the same time.
   * 
   * @param projectName 
   */
  public getProjectPageList$(projectName: string): Subject<Page[]> {
    let existingProjectPageList$: Subject<Page[]> = this._projectPageLists$.get(projectName);
    if (!existingProjectPageList$) {
      existingProjectPageList$ = new BehaviorSubject<Page[]>([]);
      this._projectPageLists$.set(projectName, existingProjectPageList$);
      this._requestProjectPageList(projectName);
    }
    
    return existingProjectPageList$;
  }
  private _projectPageLists$: Map<string, Subject<Page[]>> = new Map();
  
  private _requestProjectPageList(projectName: string): void {
    this._sendRequest(new Request(uuid.v4(), ModelService.PAGES_LIST, {project: projectName}));    
  }

  private _handleProjectPageListResponse(response: Response): void {
    // Validate data in response
    if (!response || !response.data || !(response.data instanceof Array)) {
      return;
    }

    if (response.id) {
      // This message has an ID, see if there is a pending request.
      let sentRequest: Request = this._sentRequests.get(response.id);
      if (sentRequest) {
        if (sentRequest && sentRequest.args && sentRequest.args.project) {
          let projectName: string = sentRequest.args.project;
          let existingProjectPageList$: Subject<Page[]> = this._projectPageLists$.get(projectName);
          if (!existingProjectPageList$) {
            existingProjectPageList$ = new BehaviorSubject<Page[]>([]);
            this._projectPageLists$.set(projectName, existingProjectPageList$);
          }
          existingProjectPageList$.next(response.data.map(pageData => Page.fromObject(pageData)).filter(page => page != null));
        }
      }
    }
  }


  /**
   * Observable that fires every time a Project update is received (for the subscribed to Project).
   */
  public getProjectUpdates$(): Subject<string> {
    if (!this._projectUpdates$) {
      this._projectUpdates$ = new Subject<string>();
    }
    return this._projectUpdates$;
  }
  private _projectUpdates$: Subject<string>;
  private _handleProjectUpdateResponse(response: Response): void {
    // Validate data in response
    if (!response || !response.data || !(response.data instanceof Array)) {
      return;
    }

    // Because there is no project identifier in the update, we have to assume
    // this is for the currently subscribed project. This is different than
    // how Page updates are handled on the back-end.
    let projectName: string = this._projectSubscription;

    let existingProjectPageList$: Subject<Page[]> = this._projectPageLists$.get(projectName);
    if (!existingProjectPageList$) {
      existingProjectPageList$ = new BehaviorSubject<Page[]>(null);
      this._projectPageLists$.set(projectName, existingProjectPageList$);
    }
    existingProjectPageList$.next(response.data.map(pageData => Page.fromObject(pageData)).filter(page => page != null));
    if (this._projectUpdates$) {
      this._projectUpdates$.next(projectName);
    }
  }


  /**
   * Project Subscriptions
   */
  private _projectSubscription: string;
  public subscribeToProject(projectName: string): Subject<Page[]> {
    if (this._projectSubscription != projectName) {
      // Because the back-end only allows one subscription, we don't need to send an
      // unsubscribe request if we are currently subscribed to a different project.
      this._projectSubscription = projectName;
      this._sendRequest(new Request(uuid.v4(), ModelService.PROJECT_SUBSCRIBE, {project: projectName}));
    }
    return this.getProjectPageList$(projectName);
  }

  public unsubscribeToProject(): void {
    if (this._projectSubscription) {
      this._projectSubscription = null;
      this._sendRequest(new Request(uuid.v4(), ModelService.PROJECT_UNSUBSCRIBE));
    }
  }

  public isSubscribedToProject(projectName: string): boolean {
    return this._projectSubscription == projectName;
  }



  ////////////////////////////
  // PAGES
  ////////////////////////////
  /**
   * Observable that fires every time the requested Page is updated.
   * @param pageId 
   */
  public getPageDetail$(pageId: number): Subject<Page> {
    let existingPageDetail$: Subject<Page> = this._pageDetails$.get(pageId);
    if (!existingPageDetail$) {
      existingPageDetail$ = new BehaviorSubject<Page>(null);
      this._pageDetails$.set(pageId, existingPageDetail$);
      this._requestPageDetail(pageId);
    }
    
    return existingPageDetail$;
  }
  private _pageDetails$: Map<number, Subject<Page>> = new Map();

  private _requestPageDetail(pageId: number): void {
    let request: Request = new Request(uuid.v4(), ModelService.PAGE_QUERY, {pageId: pageId});
    this._sendRequest(request);
  }
  
  private _handlePageDetailResponse(response: Response): void {
    // Validate data in response
    if (!response || !response.data) {
      return;
    }

    if (response.id) {
      // This message has an ID, see if there is a pending request.
      let sentRequest: Request = this._sentRequests.get(response.id);
      if (sentRequest) {
        if (sentRequest && sentRequest.args && sentRequest.args.pageId) {
          let pageId: number = sentRequest.args.pageId;
          let existingPageDetail$: Subject<Page> = this._pageDetails$.get(pageId);
          if (!existingPageDetail$) {
            existingPageDetail$ = new BehaviorSubject<Page>(null);
            this._pageDetails$.set(pageId, existingPageDetail$);
          }
          existingPageDetail$.next(Page.fromObject(response.data));
        }
      }
    }
  }

  /**
   * Observable that fires every time a Page update is received (for the subscribed to Page).
   */
  public getPageUpdates$(): Subject<number> {
    if (!this._pageUpdates$) {
      this._pageUpdates$ = new Subject<number>();
    }
    return this._pageUpdates$;
  }
  private _pageUpdates$: Subject<number>;
  private _handlePageUpdateResponse(response: Response): void {
    // Validate data in response
    if (!response || !response.data || !response.data.pageid) {
      return;
    }

    let pageId: number = response.data.pageid;

    // There seems to be a bug on the back-end that still pushes out updates
    // to old subscriptions. This is how we filter out that noise to only
    // the current subscribed page.
    if (this.isSubscribedToPage(pageId)) {
      let existingPageDetail$: Subject<Page> = this._pageDetails$.get(pageId);
      if (!existingPageDetail$) {
        existingPageDetail$ = new BehaviorSubject<Page>(null);
        this._pageDetails$.set(pageId, existingPageDetail$);
        existingPageDetail$.next(Page.fromObject(response.data));
      }
      else {
        let currentPage: Page = (existingPageDetail$ as BehaviorSubject<Page>).value;
        if (currentPage) {
          existingPageDetail$.next(currentPage.fromObject(response.data));
        }
        else {
          existingPageDetail$.next(Page.fromObject(response.data));
        }
      }

      // Fire off Page update, iff anyone cares
      if (this._pageUpdates$) {
        this._pageUpdates$.next(pageId);
      }
    }
  }

  /**
   * Page Subscriptions
   */
  private _pageSubscription: number;
  public subscribeToPage(pageId: number): Subject<Page> {
    if (this._pageSubscription != pageId) {
      // Because the back-end only allows one subscription, we don't need to send an
      // unsubscribe request if we are currently subscribed to a different page.
      this._pageSubscription = pageId;
      this._sendRequest(new Request(uuid.v4(), ModelService.PAGE_SUBSCRIBE, {pageId: pageId}));
    }
    return this.getPageDetail$(pageId);
  }

  public unsubscribeToPage(): void {
    if (this._pageSubscription) {
      this._pageSubscription = null;
      this._sendRequest(new Request(uuid.v4(), ModelService.PAGE_UNSUBSCRIBE));
    }
  }

  public isSubscribedToPage(pageId: number): boolean {
    return this._pageSubscription == pageId;
  }



  ///////////////////////////////////////////
  // MESSAGE HANDLERS
  ///////////////////////////////////////////
  private _sentRequests: Map<string, Request> = new Map();
  private _sendRequest(request: Request): void {
    this._sentRequests.set(request.id, request);
    this.dataService.sendMessage(request);
  }

  private _handleMessage(response: Response): void {
    if (!response) return; // Don't process if no data

    // Project List response
    if (response.name == ModelService.PROJECTS_LIST) {
      this._handleProjectListResponse(response);
    }
    // Project Update response
    else if (response.name == ModelService.PROJECT_UPDATE) {
      this._handleProjectUpdateResponse(response);
    }
    // Project Page List response
    else if (response.name == ModelService.PAGES_LIST) {
      this._handleProjectPageListResponse(response);
    }
    // Page Query response
    else if (response.name == ModelService.PAGE_QUERY) {
      this._handlePageDetailResponse(response);
    }
    // Page Update response
    else if (response.name == ModelService.PAGE_UPDATE) {
      this._handlePageUpdateResponse(response);
    }

    if (response.id) {
      // This message has an ID, see if there is a pending request.
      this._sentRequests.delete(response.id);
    }
  }
}
