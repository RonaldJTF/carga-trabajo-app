import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelValueChartComponent } from './label-value-chart.component';

describe('LabelValueChartComponent', () => {
  let component: LabelValueChartComponent;
  let fixture: ComponentFixture<LabelValueChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelValueChartComponent]
    });
    fixture = TestBed.createComponent(LabelValueChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
