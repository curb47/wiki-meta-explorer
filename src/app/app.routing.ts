import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { ProjectsComponent } from './projects/projects.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { PageDetailsComponent } from './page-details/page-details.component';

const appRoutes: Routes = [
        { path: 'page-details', component: PageDetailsComponent },
        { path: 'project-details', component: ProjectDetailsComponent },
        { path: '**', component: ProjectsComponent }
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);