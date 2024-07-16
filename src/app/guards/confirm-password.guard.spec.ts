import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmPasswordGuard } from './confirm-password.guard';

describe('confirmPasswordGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmPasswordGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
