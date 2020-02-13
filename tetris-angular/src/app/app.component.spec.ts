import {TestBed, async, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BoardComponent} from './components/board/board.component';
import {ScoreComponent} from './components/score/score.component';
import {MenuComponent} from './components/menu/menu.component';
import {FigureComponent} from './components/score/figure/figure.component';
import tetrisConstants from './contants/tetrisConstants';
import {TetrisService} from './services/tetris.service';
import {By} from '@angular/platform-browser';
import {BehaviorSubject, Subject} from 'rxjs';
import {GameStatus, PlayingArea} from './models/types';
import {Figure} from './classes/figure';

const tetrisServiceStub: Partial<TetrisService> = {
  moveFigureByPressedKey: (key: string = null): boolean => {
    return;
  },
  gameStatusSubject: new BehaviorSubject<GameStatus>(tetrisConstants.GAME_STATUSES.START),
  playingAreaWithFigureSubject: new Subject<[PlayingArea, Figure]>(),
  scoreSubject: new BehaviorSubject<number>(0),
};

describe('AppComponent', () => {
  let appComponent: AppComponent;
  let appFixture: ComponentFixture<AppComponent>;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        BoardComponent,
        ScoreComponent,
        MenuComponent,
        FigureComponent,
      ],
      providers: [
        {provide: TetrisService, useValue: tetrisServiceStub}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    appFixture = TestBed.createComponent(AppComponent);
    appComponent = appFixture.componentInstance;

    tetrisService = TestBed.get(TetrisService);

    appFixture.detectChanges();
  });

  afterEach(() => {
    appFixture.destroy();
    appComponent = null;
    tetrisService = null;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('when called moveFigureByPressedKey()', () => {
    it('should be called tetrisService.moveFigureByPressedKey()', () => {
      const moveFigureByPressedKeySpy = spyOn(tetrisService, 'moveFigureByPressedKey');

      appComponent.moveFigureByPressedKey({key: 'any'});

      expect(moveFigureByPressedKeySpy).toHaveBeenCalled();
    });
  });

  describe(`when game status is "${tetrisConstants.GAME_STATUSES.START}" or "${
    tetrisConstants.GAME_STATUSES.PAUSE}" or "${tetrisConstants.GAME_STATUSES.END}"`, () => {
    it('MenuComponent should view', () => {
      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.START);
      appFixture.detectChanges();
      expect(appFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();

      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PAUSE);
      appFixture.detectChanges();
      expect(appFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();

      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.END);
      appFixture.detectChanges();
      expect(appFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();
    });
  });

  describe(`when game status is "${tetrisConstants.GAME_STATUSES.PLAY}"`, () => {
    it('MenuComponent should not view', () => {
      tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PLAY);
      appFixture.detectChanges();
      expect(appFixture.debugElement.query(By.css('app-menu'))).toBeFalsy();
    });
  });
});
