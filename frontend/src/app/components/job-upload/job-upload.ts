import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-job-upload',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './job-upload.html',
  styleUrls: ['./job-upload.css']
})
export class JobUploadComponent {
  title: string = '';
  description: string = '';
  message: string = '';

  constructor(private apiService: ApiService) {}

  addJob() {
    const job = { title: this.title, description: this.description };

    this.apiService.addJob(job).subscribe({
      next: (res) => this.message = `Offre "${res.title}" ajoutée avec succès !`,
      error: (err) => this.message = 'Erreur lors de l’ajout du job, réessayez.'
    });
  }
}
