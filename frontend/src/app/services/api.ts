import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000'; //backend FastAPI

  constructor(private http: HttpClient) {}

  uploadCV(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload_cv/`, formData);
  }

  addJob(job: { title: string; description: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/job/upload`, job);
  }
  getJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/job/all`);
  }

  matchJob(jobId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/match/job/${jobId}`, {});
  }
}
