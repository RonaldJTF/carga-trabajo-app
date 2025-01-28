import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormJobTitleComponent } from './form-job-title.component';

describe('FormJobTitleComponent', () => {
  let component: FormJobTitleComponent;
  let fixture: ComponentFixture<FormJobTitleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormJobTitleComponent]
    });
    fixture = TestBed.createComponent(FormJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
