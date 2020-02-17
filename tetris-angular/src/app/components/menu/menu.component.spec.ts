import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MenuComponent} from './menu.component';
import {TetrisService} from '../../services/tetris.service';
import tetrisConstants from '../../contants/tetrisConstants';
import {By} from '@angular/platform-browser';
import {BoardService} from "../../services/board.service";

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('MenuComponent.continueGame()', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [TetrisService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('continueGame button should call tetrisService.continueGame()', () => {
    const continueGameSpy = spyOn(tetrisService, 'continueGame');
    component.displayContinueGameBtn$ = true;
    fixture.detectChanges();
    const continueBtnEl = fixture.debugElement.query(By.css('#continue-btn'));
    tetrisService.startGame();
    tetrisService.pauseGame();
    continueBtnEl.triggerEventHandler('click', null);

    expect(continueGameSpy).toHaveBeenCalled();

    tetrisService.pauseGame();
  });
});

describe('MenuComponent.startGame()', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        TetrisService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`startGame button should call tetriceService.startGame()`, () => {
    const startGameSpy = spyOn(tetrisService, 'startGame');
    const startGameBtnEl = fixture.debugElement.query(By.css('#start-game-btn'));
    startGameBtnEl.triggerEventHandler('click', null);

    expect(startGameSpy).toHaveBeenCalledTimes(1);

    tetrisService.pauseGame();
  });
});

describe('MenuComponent score result', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let tetrisService: TetrisService;
  let boardService: BoardService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        TetrisService,
        BoardService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tetrisService = TestBed.get(TetrisService);
    boardService = TestBed.get(BoardService);
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`should contain "Score 'score'" if game status is ${tetrisConstants.GAME_STATUSES.PAUSE}`, fakeAsync(() => {
    const scoreValue = 1000;
    tetrisService.startGame();
    tetrisService.scoreSubject.next(scoreValue);

    tetrisService.pauseGame();
    fixture.detectChanges();

    const scoreResultEl = fixture.debugElement.query(By.css('#score-result'));

    expect(scoreResultEl.nativeElement.innerHTML).toMatch(`Score ${scoreValue}`);
  }));

  it(`should contain "Game over!" and "Your score is 'score'" if game status is ${tetrisConstants.GAME_STATUSES.END}`, fakeAsync(() => {
    const playingAreaFake = [
      [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [null, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];
    const playingAreaSpy = spyOn(boardService, 'generatePlayingArea').and.returnValue(playingAreaFake);
    const scoreValue = 1000;

    tetrisService.startGame();
    tetrisService.scoreSubject.next(scoreValue);

    tick(3000);
    fixture.detectChanges();
    const scoreResultEl = fixture.debugElement.query(By.css('#score-result'));

    expect(scoreResultEl.nativeElement.innerHTML).toMatch(/Game over!/);
    expect(scoreResultEl.nativeElement.innerText).toMatch(`Your score is ${scoreValue}`);
  }));
});
