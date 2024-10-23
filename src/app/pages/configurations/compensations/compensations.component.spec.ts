import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompensationsComponent } from './compensations.component';

describe('CompensationsComponent', () => {
  let component: CompensationsComponent;
  let fixture: ComponentFixture<CompensationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompensationsComponent]
    });
    fixture = TestBed.createComponent(CompensationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
