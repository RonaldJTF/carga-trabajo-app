import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomChartComponent } from './custom-chart.component';

describe('LinearChartComponent', () => {
  let component: CustomChartComponent;
  let fixture: ComponentFixture<CustomChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomChartComponent]
    });
    fixture = TestBed.createComponent(CustomChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
