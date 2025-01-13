import { TestBed } from '@angular/core/testing';

import { ProcessOrientedStructureService } from './process-oriented-structure.service';

describe('ProcessOrientedStructureService', () => {
  let service: ProcessOrientedStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessOrientedStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
