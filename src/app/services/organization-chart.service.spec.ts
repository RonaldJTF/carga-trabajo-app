import { TestBed } from '@angular/core/testing';

import { OrganizationChartService } from './organization-chart.service';

describe('OrganizationChartService', () => {
  let service: OrganizationChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
