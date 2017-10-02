import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Project } from '../model/project';

import { ModelService } from '../services/model.service';

@Component({
  selector: 'projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  constructor(public modelService: ModelService, private _router: Router) {
  }

  public selectProject(project: Project): void {
    this.modelService.selectedProject = project;
    this._router.navigate(['/project-details']);
  }

  ngOnInit() {
  }

}
