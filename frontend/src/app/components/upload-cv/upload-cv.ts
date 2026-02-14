import { Component } from '@angular/core';
import { ApiService } from '../../services/api';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-upload-cv',
  standalone: true, 
  imports: [CommonModule, HttpClientModule],
  templateUrl: './upload-cv.html',
  styleUrls: ['./upload-cv.scss']
})
export class UploadCvComponent {
  selectedFile: File | null = null;
  message: string = '';
  isUploading: boolean = false;
  isSuccess: boolean = false;

  constructor(private apiService: ApiService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.message = '';
    this.isSuccess = false;
  }

  uploadCV() {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.message = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.apiService.uploadCV(formData).subscribe({
      next: (res) => {
        this.message = `CV ${res.filename} uploadé avec succès !`;
        this.isSuccess = true;
        this.isUploading = false;
        this.selectedFile = null;
        
        setTimeout(() => {
          this.message = '';
        }, 5000);
      },
      error: (err) => {
        this.message = 'Erreur lors de l\'upload, réessayez.';
        this.isSuccess = false;
        this.isUploading = false;
      }
    });
  }
  clearFile() {
    this.selectedFile = null;
    this.message = '';
  }

  getFileIcon(): string {
    if (!this.selectedFile) return 'bi bi-file-earmark fs-4 text-muted';
    
    const filename = this.selectedFile.name.toLowerCase();
    if (filename.endsWith('.pdf')) {
      return 'bi bi-file-earmark-pdf text-danger fs-4';
    } else if (filename.match(/\.(doc|docx)$/)) {
      return 'bi bi-file-earmark-word text-primary fs-4';
    }
    return 'bi bi-file-earmark text-muted fs-4';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
