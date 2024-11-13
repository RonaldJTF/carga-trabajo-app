import { TestBed } from '@angular/core/testing';

import { LevelCompensationService } from './level-compensation.service';

describe('LevelCompensationService', () => {
  let service: LevelCompensationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelCompensationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
