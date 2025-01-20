import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationChartMenuItemComponent } from './organization-chart-menu-item.component';

describe('OrganizationChartMenuItemComponent', () => {
  let component: OrganizationChartMenuItemComponent;
  let fixture: ComponentFixture<OrganizationChartMenuItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationChartMenuItemComponent]
    });
    fixture = TestBed.createComponent(OrganizationChartMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
