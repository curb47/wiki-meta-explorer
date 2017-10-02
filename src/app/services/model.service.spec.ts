import { TestBed, inject } from '@angular/core/testing';

import { ModelService } from './model.service';

describe('ModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ModelService]
    });
  });

  it('should be created', inject([ModelService], (service: ModelService) => {
    expect(service).toBeTruthy();
  }));

  // getProjects$
  it('should return list of current projects', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // getProjectPageList$
  it('should return list of current projects pages', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // getProjectUpdates$
  it('should be notified of project updates', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // subscribeToProject
  it('should subscribe to a project', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // unsubscribeToProject
  it('should unsubscribe from a project', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // isSubscribedToProject
  it('should correctly determine is subscribed to project', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // getPageDetails$
  it('should return page details', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // getPageUpdates$
  it('should be notified of page updates', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // subscribeToPage
  it('should subscribe to a page', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // unsubscribeToPage
  it('should unsubscribe from a page', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // isSubscribedToPage
  it('should correctly determine is subscribed to page', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // handleMessage
  it('should correctly route received messages', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));

  // sentRequests
  it('should keep track of and remove sent requests', inject([ModelService], (service: ModelService) => {
    // TODO:
  }));
});
