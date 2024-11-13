import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationCategoriesComponent } from './compensation-categories.component';

describe('CompensationCategoriesComponent', () => {
  let component: CompensationCategoriesComponent;
  let fixture: ComponentFixture<CompensationCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompensationCategoriesComponent]
    });
    fixture = TestBed.createComponent(CompensationCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
