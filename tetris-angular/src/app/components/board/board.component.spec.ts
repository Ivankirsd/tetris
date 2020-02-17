import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {BoardComponent} from './board.component';
import {TetrisService} from "../../services/tetris.service";
import {BoardService} from "../../services/board.service";
import {FigureService} from "../../services/figure.service";
import {By} from "@angular/platform-browser";
import {take} from "rxjs/operators";

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let tetrisService: TetrisService;
  let boardService: BoardService;
  let figureService: FigureService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BoardComponent],
      providers: [
        TetrisService,
        BoardService,
        FigureService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
    figureService = TestBed.get(FigureService);
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('after startGame should render playingArea', fakeAsync(() => {
    tetrisService.startGame();
    tick(500);
    fixture.detectChanges();
    tick(1000);
    const templateRowCount = fixture.debugElement.queryAll(By.css('.row')).length;
    const templateCellInRowCount = fixture.debugElement.queryAll(By.css('.cell')).length / templateRowCount;

    expect(templateRowCount).toBeGreaterThan(0);
    expect(templateCellInRowCount).toBeGreaterThan(0);

    tetrisService.pauseGame();
  }));

  it('rendered playingArea should be given size', fakeAsync(() => {
    const sizeX = 9;
    const sizeY = 4;
    const fakePlayingArea = [
      [null, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    spyOn(boardService, 'generatePlayingArea').and.returnValue(fakePlayingArea);

    tetrisService.startGame();
    tick(500);
    fixture.detectChanges();
    tick(1000);

    const templateRowCount = fixture.debugElement.queryAll(By.css('.row')).length;
    const templateCellInRowCount = fixture.debugElement.queryAll(By.css('.cell')).length / templateRowCount;

    expect(templateRowCount).toBe(sizeY);
    expect(templateCellInRowCount).toBe(sizeX);

    tetrisService.pauseGame();
  }));

  it('active cells should coincide with figure position', fakeAsync(() => {
      const figure = figureService.generateRandomFigure();
      spyOn(figureService, 'generateRandomFigure').and.returnValue(figure);
      tetrisService.startGame();
      tick(2500);

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
      tick(1000);
      tetrisService.pauseGame();
    }
  ));
});
