import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {BoardComponent} from './board.component';
import {TetrisService} from '../../services/tetris.service';
import {BoardService} from '../../services/board.service';
import {FigureService} from '../../services/figure.service';
import {By} from '@angular/platform-browser';
import {Figure} from '../../classes/figure';
import {Subject} from 'rxjs';
import {PlayingArea} from '../../models/types';
import {take} from 'rxjs/operators';

const tetrisServiceSub: Partial<TetrisService> = {
  playingAreaWithFigureSubject: new Subject<[PlayingArea, Figure]>(),
};

const boardServiceSub: Partial<BoardService> = {
  generatePlayingArea: (syzeX = 8, syzeY = 15) => {
    return Array(syzeY).fill(null).map(() => {
      return Array(syzeX).fill(null);
    });
  },
};

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let tetrisService: TetrisService;
  let figureService: FigureService;
  let boardService: BoardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: [
        {provide: TetrisService, useValue: tetrisServiceSub},
        {provide: BoardService, useValue: boardServiceSub},
        FigureService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);
    figureService = TestBed.get(FigureService);
    boardService = TestBed.get(BoardService);

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    fixture = null;
    component = null;

    tetrisService = null;
    figureService = null;
    boardService = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when called tetrisService.startGame()', () => {
    it(' playingArea should be rendered', fakeAsync(() => {
      let templateRowCount: number;
      let templateCellsInRowCount: number;
      const playingArea = boardService.generatePlayingArea();
      const figure = figureService.generateRandomFigure();

      tetrisService.playingAreaWithFigureSubject.next([playingArea, figure]);

      fixture.detectChanges();

      templateRowCount = fixture.debugElement.queryAll(By.css('.row')).length;
      templateCellsInRowCount = fixture.debugElement.queryAll(By.css('.cell')).length / templateRowCount;

      expect(templateRowCount).toBeGreaterThan(0);
      expect(templateCellsInRowCount).toBeGreaterThan(0);
    }));
  });

  describe('when playingArea was rendered', () => {

    it('rendered playingArea should be given size', fakeAsync(() => {
      const sizeX = 9;
      const sizeY = 5;
      const playingArea = boardService.generatePlayingArea(sizeX, sizeY);
      const figure = figureService.generateRandomFigure();
      figure.dY = 2;

      tetrisService.playingAreaWithFigureSubject.next([playingArea, figure]);
      fixture.detectChanges();
      tick(1000);

      const templateRowCount = fixture.debugElement.queryAll(By.css('.row')).length;
      const templateCellInRowCount = fixture.debugElement.queryAll(By.css('.cell')).length / templateRowCount;

      expect(templateRowCount).toBe(sizeY);
      expect(templateCellInRowCount).toBe(sizeX);

    }));

    it('active cells should coincide with figure position', fakeAsync(() => {
      const playingArea = boardService.generatePlayingArea();
      const figure = figureService.generateRandomFigure();
      figure.dY = 5;

      component.playingAreaWithFigure$
        .pipe(
          take(1)
        )
        .subscribe(playingAreaWithFigure => {
          figure.getFigurePosition().forEach(row => {
            row.forEach(cell => {
              if (cell) {
                expect(playingAreaWithFigure[cell[0]][cell[1]]).not.toBe(null);
              }
            });
          });
        });
      tetrisService.playingAreaWithFigureSubject.next([playingArea, figure]);
    }));
  });


});
