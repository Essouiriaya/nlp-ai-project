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
  styleUrls: ['./ranking.scss']
})
export class RankingComponent implements OnInit {
  jobs: any[] = [];
  selectedJobId: number | null = null;
  cvList: any[] = [];
  loading: boolean = false;

  searchTerm: string = '';
  filteredCvList: any[] = [];
  sortBy: 'score' | 'name' = 'score';
  hasAttemptedRun: boolean = false;
  progressValue: number = 0;
  private progressInterval: any;

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
    this.filteredCvList = [];
    this.progressValue = 0;

    this.progressInterval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += Math.random() * 15;
        if (this.progressValue > 90) this.progressValue = 90;
      }
    }, 300);

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

  filterResults() {
    if (!this.searchTerm) {
      this.filteredCvList = [...this.cvList];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCvList = this.cvList.filter(cv => 
        cv.filename?.toLowerCase().includes(term)
      );
    }
    this.sortResults(this.sortBy);
  }

  sortResults(criteria: 'score' | 'name') {
    this.sortBy = criteria;
    this.filteredCvList.sort((a, b) => {
      if (criteria === 'score') {
        return b.score - a.score;
      } else {
        return (a.filename || '').localeCompare(b.filename || '');
      }
    });
  }

  getInitials(filename: string): string {
    if (!filename) return '??';
    const clean = filename.replace(/[_-]/g, ' ').replace(/\.[^/.]+$/, '');
    const parts = clean.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  }

  cleanFilename(filename: string): string {
    if (!filename) return 'Unknown';
    return filename
      .replace(/[_-]/g, ' ')
      .replace(/\.[^/.]+$/, '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
  }

  getScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Très bon';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  }

  get averageScore(): number {
    if (!this.cvList.length) return 0;
    return this.cvList.reduce((sum, cv) => sum + (cv.score || 0), 0) / this.cvList.length;
  }

  getTopPercentage(): number {
    if (!this.cvList.length) return 0;
    const qualified = this.cvList.filter(cv => cv.score > 75).length;
    return Math.round((qualified / this.cvList.length) * 100);
  }

  viewCV(cv: any) {
    console.log('View CV:', cv);
  }

  downloadCV(cv: any) {
    console.log('Download CV:', cv);
  }

  refreshData() {
    this.selectedJobId = null;
    this.cvList = [];
    this.filteredCvList = [];
    this.hasAttemptedRun = false;
    this.searchTerm = '';
    this.loadJobs();
  }

  exportResults() {
    const csvContent = this.convertToCSV(this.cvList);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classement-job-${this.selectedJobId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(data: any[]): string {
    const headers = ['Rang', 'Nom du CV', 'Score (%)'];
    const rows = data.map((cv, index) => [
      index + 1,
      cv.filename,
      cv.score.toFixed(2)
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
