import { TestBed } from '@angular/core/testing';

import { TipodocumentoService } from './tipodocumento.service';

describe('TipodocumentoService', () => {
  let service: TipodocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipodocumentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
