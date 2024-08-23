import { TestBed } from '@angular/core/testing';

import { SentryInitService } from './sentry-init.service';

describe('SentryInitService', () => {
  let service: SentryInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SentryInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
