import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobUpload } from './job-upload';

describe('JobUpload', () => {
  let component: JobUpload;
  let fixture: ComponentFixture<JobUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
