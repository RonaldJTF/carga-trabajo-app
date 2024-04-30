import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonListGridComponent } from './skeleton-list-grid.component';

describe('SkeletonListGridComponent', () => {
  let component: SkeletonListGridComponent;
  let fixture: ComponentFixture<SkeletonListGridComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkeletonListGridComponent]
    });
    fixture = TestBed.createComponent(SkeletonListGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
