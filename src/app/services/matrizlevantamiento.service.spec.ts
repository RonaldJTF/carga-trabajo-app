import { TestBed } from '@angular/core/testing';

import { MatrizlevantamientoService } from './matrizlevantamiento.service';

describe('MatrizlevantamientoService', () => {
  let service: MatrizlevantamientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrizlevantamientoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
