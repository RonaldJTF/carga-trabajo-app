import { TestBed } from '@angular/core/testing';

import { OperationalManagementService } from './operational-management.service';

describe('OperationalManagementService', () => {
  let service: OperationalManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationalManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
