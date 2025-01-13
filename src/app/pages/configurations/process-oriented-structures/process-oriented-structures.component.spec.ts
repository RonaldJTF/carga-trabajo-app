import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessOrientedStructuresComponent } from './process-oriented-structures.component';

describe('ProcessOrientedStructuresComponent', () => {
  let component: ProcessOrientedStructuresComponent;
  let fixture: ComponentFixture<ProcessOrientedStructuresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessOrientedStructuresComponent]
    });
    fixture = TestBed.createComponent(ProcessOrientedStructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
