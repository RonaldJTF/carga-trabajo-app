import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDocumentTypeComponent } from './form-document-type.component';

describe('FormDocumentTypeComponent', () => {
  let component: FormDocumentTypeComponent;
  let fixture: ComponentFixture<FormDocumentTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormDocumentTypeComponent]
    });
    fixture = TestBed.createComponent(FormDocumentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
