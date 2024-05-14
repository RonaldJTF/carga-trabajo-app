import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodySkeletonComponent } from './body-skeleton.component';

describe('BodySkeletonComponent', () => {
  let component: BodySkeletonComponent;
  let fixture: ComponentFixture<BodySkeletonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BodySkeletonComponent]
    });
    fixture = TestBed.createComponent(BodySkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
