import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanResumeComponent } from './workplan-resume.component';

describe('WorkplanResumeComponent', () => {
  let component: WorkplanResumeComponent;
  let fixture: ComponentFixture<WorkplanResumeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkplanResumeComponent]
    });
    fixture = TestBed.createComponent(WorkplanResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
