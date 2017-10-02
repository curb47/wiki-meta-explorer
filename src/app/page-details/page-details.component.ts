import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Page } from '../model/page';

import { ModelService } from '../services/model.service';

@Component({
  selector: 'page-details',
  templateUrl: './page-details.component.html',
  styleUrls: ['./page-details.component.css']
})
export class PageDetailsComponent implements OnInit {

  constructor(public modelService: ModelService, private _router: Router) {
    if (!this.modelService.selectedProject) {
      this._router.navigate(['/']);
    }
    if (!this.modelService.selectedPage) {
      this._router.navigate(['/project-details']);
    }

    this.modelService.getPageUpdates$().subscribe(pageId => {
      if (pageId == this.modelService.selectedPage.id) {
        this.pageUpdated = true;
      }
    });
  }

  ngOnInit() {
  }

  public goBack(): void {
    this._router.navigate(['/project-details']);
  }

  public pageUpdated: boolean = false;
  public clearPageUpdated(): void {
    this.pageUpdated = false;
  }
  
}
