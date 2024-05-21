import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplansComponent } from './workplans.component';

describe('WorkplansComponent', () => {
  let component: WorkplansComponent;
  let fixture: ComponentFixture<WorkplansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkplansComponent]
    });
    fixture = TestBed.createComponent(WorkplansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
