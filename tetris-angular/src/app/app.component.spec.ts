import {TestBed, async, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {BoardComponent} from './components/board/board.component';
import {ScoreComponent} from './components/score/score.component';
import {MenuComponent} from './components/menu/menu.component';
import {FigureComponent} from "./components/score/figure/figure.component";
import tetrisConstants from "./contants/tetrisConstants";
import {of} from "rxjs";
import {TetrisService} from "./services/tetris.service";
import {By} from "@angular/platform-browser";

describe('AppComponent', () => {
  let appComponent: AppComponent;
  let appComponentFixture: ComponentFixture<AppComponent>;
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
    }).compileComponents();
  }));

  beforeEach(() => {
    appComponentFixture = TestBed.createComponent(AppComponent);
    appComponent = appComponentFixture.componentInstance;

    tetrisService = TestBed.get(TetrisService);

    appComponentFixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should view MenuComponent if game status is not "${tetrisConstants.GAME_STATUSES.PLAY}"`, () => {
    tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.START);
    appComponentFixture.detectChanges();

    expect(appComponentFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();

    tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PLAY);
    appComponentFixture.detectChanges();

    expect(appComponentFixture.debugElement.query(By.css('app-menu'))).toBeFalsy();

    tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PAUSE);
    appComponentFixture.detectChanges();

    expect(appComponentFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();

    tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.END);
    appComponentFixture.detectChanges();

    expect(appComponentFixture.debugElement.query(By.css('app-menu'))).toBeTruthy();

  });

  it('should call tetrisService.moveFigureByPressedKey() if keydown event is triggered', () => {
    const keyMock = 'ArrowUp';
    const moveFigureByPressedKeySpy = spyOn(tetrisService, 'moveFigureByPressedKey');

    appComponent.moveFigureByPressedKey({key: keyMock});
    expect(moveFigureByPressedKeySpy).toHaveBeenCalledWith(keyMock);
  });


});
