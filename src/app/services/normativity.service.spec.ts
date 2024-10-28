import { TestBed } from '@angular/core/testing';

import { NormativityService } from './normativity.service';

describe('NormativityService', () => {
  let service: NormativityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormativityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
