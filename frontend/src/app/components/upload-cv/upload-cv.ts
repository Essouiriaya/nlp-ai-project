import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-upload-cv',
  standalone: true, 
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload-cv.html',
  styleUrls: ['./upload-cv.css']
})
export class UploadCvComponent {
  selectedFile: File | null = null;
  message: string = '';

  constructor(private apiService: ApiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
  }

  uploadCV() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.apiService.uploadCV(formData).subscribe({
      next: (res) => this.message = `CV ${res.filename} uploadé avec succès !`,
      error: (err) => this.message = 'Erreur lors de l’upload, réessayez.'
    });
  }
}
