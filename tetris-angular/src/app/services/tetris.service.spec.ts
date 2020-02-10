import { TestBed } from '@angular/core/testing';

import { TetrisService } from './tetris.service';

describe('TetrisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TetrisService = TestBed.get(TetrisService);
    expect(service).toBeTruthy();
  });
});
