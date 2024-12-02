import { TestBed } from '@angular/core/testing';
import { StatisticsService } from './statistics.service';
import { beforeEach, describe, it } from 'node:test';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {});
});
