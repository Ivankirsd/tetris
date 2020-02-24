import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ScoreComponent} from './score.component';
import {FigureService} from '../../services/figure.service';
import {FigureComponent} from './figure/figure.component';
import {TetrisService} from '../../services/tetris.service';
import {By} from '@angular/platform-browser';
import {of} from "rxjs";

const tetrisServiceStub: Partial<TetrisService> = {
  pauseGame: (): void => {
  },
};

describe('ScoreComponent', () => {
  let scoreComponent: ScoreComponent;
  let scoreFixture: ComponentFixture<ScoreComponent>;

  let tetrisService: TetrisService;
  let figureService: FigureService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScoreComponent,
        FigureComponent
      ],
      providers: [
        {provide: TetrisService, useValue: tetrisServiceStub},
        FigureService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    scoreFixture = TestBed.createComponent(ScoreComponent);
    scoreComponent = scoreFixture.componentInstance;

    scoreFixture.detectChanges();
  });

  afterEach(() => {
    scoreFixture.destroy();

    scoreComponent = null;
    scoreFixture = null;
  });

  it('should create', () => {
    expect(scoreComponent).toBeTruthy();
  });
  describe('when called pauseGame()', () => {

    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);

    });

    afterEach(() => {
      tetrisService = null;
    });

    it('should be called tetrisService.pauseGame()', () => {
      const pauseGameSpy = spyOn(tetrisService, 'pauseGame');
      const pauseBtnEl = scoreFixture.debugElement.query(By.css('#pause-btn'));

      pauseBtnEl.triggerEventHandler('click', null);

      expect(pauseGameSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when score value is updated', () => {
    it('score value should be updated in template', () => {
      const scoreEl = scoreFixture.debugElement.query(By.css('#score'));
      const scoreValues = [0, 5, 15, 1000];

      scoreValues.forEach(scoreValue => {
        scoreComponent.score$ = of(scoreValue);
        scoreFixture.detectChanges();

        expect(scoreEl.nativeElement.innerHTML).toMatch(`Score ${scoreValue}`);
      });
    });
  });

  describe('when figures are updated', () => {
    beforeEach(() => {
      figureService = TestBed.get(FigureService);
    });

    afterEach(() => {
      figureService = null;
    });

    it(`figues template should be updated`, () => {
      let figuresElements;

      const figuresArrays = [
        [figureService.generateRandomFigure()],
        [figureService.generateRandomFigure(), figureService.generateRandomFigure()],
        [figureService.generateRandomFigure(), figureService.generateRandomFigure(), figureService.generateRandomFigure()],
      ];

      figuresArrays.forEach(figures => {
        scoreComponent.figures$ = of(figures);
        scoreFixture.detectChanges();
        figuresElements = scoreFixture.debugElement.queryAll(By.css('app-figure'));

        expect(figuresElements.length).toBe(figures.length);
      });
    });

    it('figure should be set to figureComponent', () => {
      const figures = [figureService.generateRandomFigure()];
      scoreComponent.figures$ = of(figures);
      scoreFixture.detectChanges();

      const figureEl = scoreFixture.debugElement.query(By.css('app-figure'));
      const figureComponent: FigureComponent = figureEl.componentInstance;
      scoreFixture.detectChanges();

      expect(figureComponent.figureModel).toBe(figures[0].getFigureModel());
    });
  });
});
