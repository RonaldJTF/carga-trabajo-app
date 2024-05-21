import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkplanComponent } from './workplan.component';

describe('WorkplanComponent', () => {
  let component: WorkplanComponent;
  let fixture: ComponentFixture<WorkplanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkplanComponent]
    });
    fixture = TestBed.createComponent(WorkplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
