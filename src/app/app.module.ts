import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { BaseDataService, DataService } from './services/data.service';
import { ModelService } from './services/model.service';

import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { PageDetailsComponent } from './page-details/page-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectDetailsComponent,
    PageDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    routing
  ],
  providers: [
    appRoutingProviders,
    {provide: BaseDataService, useClass: DataService},
    ModelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }