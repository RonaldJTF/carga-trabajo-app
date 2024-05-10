import { TestBed } from '@angular/core/testing';

import { GenderService } from './gender.service';

describe('GenreService', () => {
  let service: GenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
