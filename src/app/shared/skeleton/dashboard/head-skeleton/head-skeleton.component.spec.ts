import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadSkeletonComponent } from './head-skeleton.component';

describe('HeadSkeletonComponent', () => {
  let component: HeadSkeletonComponent;
  let fixture: ComponentFixture<HeadSkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadSkeletonComponent]
    });
    fixture = TestBed.createComponent(HeadSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
