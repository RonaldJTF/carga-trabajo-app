import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLevelComponent } from './form-level.component';

describe('FormLevelComponent', () => {
  let component: FormLevelComponent;
  let fixture: ComponentFixture<FormLevelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormLevelComponent]
    });
    fixture = TestBed.createComponent(FormLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
