import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationCategoryComponent } from './compensation-category.component';

describe('CompensationCategoryComponent', () => {
  let component: CompensationCategoryComponent;
  let fixture: ComponentFixture<CompensationCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompensationCategoryComponent]
    });
    fixture = TestBed.createComponent(CompensationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
