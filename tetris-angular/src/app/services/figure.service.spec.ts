import { TestBed } from '@angular/core/testing';

import { FigureService } from './figure.service';

describe('FigureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FigureService = TestBed.get(FigureService);
    expect(service).toBeTruthy();
  });
});
