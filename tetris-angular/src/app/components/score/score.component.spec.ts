import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoreComponent} from './score.component';
import {FigureService} from '../../services/figure.service';
import {FigureComponent} from './figure/figure.component';
import {TetrisService} from '../../services/tetris.service';
import tetrisConstants from '../../contants/tetrisConstants';
import {By} from '@angular/platform-browser';

describe('ScoreComponent', () => {
  let scoreComponent: ScoreComponent;
  let scoreFixture: ComponentFixture<ScoreComponent>;
  let figureFixture: ComponentFixture<FigureComponent>;
  let figureComponent: FigureComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreComponent,
        FigureComponent
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    scoreFixture = TestBed.createComponent(ScoreComponent);
    figureFixture = TestBed.createComponent(FigureComponent);

    scoreComponent = scoreFixture.componentInstance;
    figureComponent = figureFixture.componentInstance;

    scoreFixture.detectChanges();
  });

  it('should create', () => {
    expect(scoreComponent).toBeTruthy();
  });
});

describe('ScoreComponent.pauseGame()', () => {
  let scoreComponent: ScoreComponent;
  let scoreFixture: ComponentFixture<ScoreComponent>;
  let figureFixture: ComponentFixture<FigureComponent>;
  let figureComponent: FigureComponent;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreComponent,
        FigureComponent,
      ],
      providers: [
        TetrisService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);

    scoreFixture = TestBed.createComponent(ScoreComponent);
    figureFixture = TestBed.createComponent(FigureComponent);
    scoreComponent = scoreFixture.componentInstance;
    figureComponent = figureFixture.componentInstance;

    scoreFixture.detectChanges();
  });

  it('click on pause-btn should call tetrisService.pauseGame()', () => {
    const pauseGameSpy = spyOn(tetrisService, 'pauseGame');
    const pauseBtnEl = scoreFixture.debugElement.query(By.css('#pause-btn'));

    pauseBtnEl.triggerEventHandler('click', null);

    expect(pauseGameSpy).toHaveBeenCalledTimes(1);
  });
});

describe('ScoreComponent score template value', () => {
  let scoreComponent: ScoreComponent;
  let scoreFixture: ComponentFixture<ScoreComponent>;
  let figureFixture: ComponentFixture<FigureComponent>;
  let figureComponent: FigureComponent;

  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreComponent,
        FigureComponent,
      ],
      providers: [
        TetrisService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);

    scoreFixture = TestBed.createComponent(ScoreComponent);
    figureFixture = TestBed.createComponent(FigureComponent);
    scoreComponent = scoreFixture.componentInstance;
    figureComponent = figureFixture.componentInstance;

    scoreFixture.detectChanges();
  });

  it('changing score value should update template score value', () => {
    const scoreEl = scoreFixture.debugElement.query(By.css('#score'));
    const newScore = 1000;

    tetrisService.scoreSubject.next(newScore);
    scoreFixture.detectChanges();

    expect(scoreEl.nativeElement.innerHTML).toMatch(`Score ${newScore}`);
  });
});

describe('ScoreComponent figures ', () => {
  let scoreComponent: ScoreComponent;
  let scoreFixture: ComponentFixture<ScoreComponent>;
  let figureFixture: ComponentFixture<FigureComponent>;
  let figureComponent: FigureComponent;

  let figureService: FigureService;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreComponent,
        FigureComponent,
      ],
      providers: [
        FigureService,
        TetrisService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    figureService = TestBed.get(FigureService);
    tetrisService = TestBed.get(TetrisService);

    scoreFixture = TestBed.createComponent(ScoreComponent);
    figureFixture = TestBed.createComponent(FigureComponent);

    scoreComponent = scoreFixture.componentInstance;
    figureComponent = figureFixture.componentInstance;


    scoreFixture.detectChanges();
  });

  it(`changing figuresArray value should update template figures`, () => {
    let figuresElements = scoreFixture.debugElement.queryAll(By.css('app-figure'));

    expect(figuresElements.length).toBe(0);

    tetrisService.figuresArraySubject.next(
      [
        figureService.generateRandomFigure(),
        figureService.generateRandomFigure(),
      ]
    );
    scoreFixture.detectChanges();

    figuresElements = scoreFixture.debugElement.queryAll(By.css('app-figure'));

    expect(figuresElements.length).toBe(2);
  });
});

