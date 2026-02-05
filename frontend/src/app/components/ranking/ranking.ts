import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './ranking.html',
  styleUrls: ['./ranking.css']
})
export class RankingComponent implements OnInit {
  jobs: any[] = [];
  selectedJobId: number | null = null;
  cvList: any[] = [];
  loading: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.apiService.getJobs().subscribe({
      next: (res) => this.jobs = res,
      error: (err) => console.error('Erreur récupération jobs', err)
    });
  }

  runMatching() {
    if (!this.selectedJobId) return;
    this.loading = true;
    this.cvList = [];

    this.apiService.matchJob(this.selectedJobId).subscribe({
      next: (res) => {
        this.cvList = res.ranking || []; 
        this.cvList.sort((a, b) => b.score - a.score);
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur matching', err);
        this.loading = false;
      }
    });
  }

}
