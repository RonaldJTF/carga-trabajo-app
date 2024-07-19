import { TestBed } from '@angular/core/testing';

import { BasicTablesService } from './basic-tables.service';

describe('BasicTablesService', () => {
  let service: BasicTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
