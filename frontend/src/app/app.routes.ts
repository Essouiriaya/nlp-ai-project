// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { UploadCvComponent } from './components/upload-cv/upload-cv';
import { JobUploadComponent } from './components/job-upload/job-upload';
import { RankingComponent } from './components/ranking/ranking';

export const routes: Routes = [
  { path: '', redirectTo: '/upload-cv', pathMatch: 'full' },
  { path: 'upload-cv', component: UploadCvComponent },
  { path: 'job-upload', component: JobUploadComponent },
  { path: 'ranking', component: RankingComponent },
  { path: '**', redirectTo: '/upload-cv' }
];
