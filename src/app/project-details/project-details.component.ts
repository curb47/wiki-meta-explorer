import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { ModelService } from '../services/model.service';

import { Project } from '../model/project';
import { Page } from '../model/page';

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {

  constructor(public modelService: ModelService, private _router: Router) {
    if (!this.modelService.selectedProject) {
      this._router.navigate(['/']);      
    }

    this.modelService.getProjectUpdates$().subscribe(projectName => {
      if (projectName == this.modelService.selectedProject.name) {
        this.projectUpdated = true;
      }
    });
  }

  ngOnInit() {
  }

  public projectUpdated: boolean = false;
  public clearProjectUpdated(): void {
    this.projectUpdated = false;
  }
  
  public goBack(): void {
    this._router.navigate(['/']);
  }

  public selectPage(page: Page): void {
    this.modelService.selectedPage = page;
    this._router.navigate(['/page-details']);
  }  

}
