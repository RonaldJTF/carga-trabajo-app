import { TestBed } from '@angular/core/testing';

import { KeySequenceService } from './key-sequence.service';

describe('KeySequenceService', () => {
  let service: KeySequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeySequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
