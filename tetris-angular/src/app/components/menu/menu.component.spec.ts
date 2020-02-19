import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {MenuComponent} from './menu.component';
import {TetrisService} from '../../services/tetris.service';
import tetrisConstants from '../../contants/tetrisConstants';
import {By} from '@angular/platform-browser';
import {BoardService} from '../../services/board.service';
import {BehaviorSubject, of} from 'rxjs';
import {GameStatus} from '../../models/types';
import {FigureService} from '../../services/figure.service';


const tetrisServiceStub: Partial<TetrisService> = {
  scoreSubject: new BehaviorSubject<number>(0),
  gameStatusSubject: new BehaviorSubject<GameStatus>(tetrisConstants.GAME_STATUSES.START),
  startGame: () => {},
  continueGame: () => {}
};

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let tetrisService: TetrisService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuComponent],
      providers: [
        {provide: TetrisService, useValue: tetrisServiceStub, deps: [BoardService, FigureService]},
      ]
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

  describe('when created', () => {

    describe('score', () => {

      beforeEach(() => {
        tetrisService = TestBed.get(TetrisService);
        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

      afterEach(() => {
        tetrisService = null;
        fixture.destroy();
        fixture = null;
        component = null;
      });

      it(`should contain "Score \${score}" if game status is "${tetrisConstants.GAME_STATUSES.PAUSE}"`, () => {
        const scoreValue = 1000;
        tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.PAUSE);
        tetrisService.scoreSubject.next(scoreValue);

        fixture.detectChanges();

        const scoreResultEl = fixture.debugElement.query(By.css('#score-result'));

        expect(scoreResultEl.nativeElement.innerHTML).toMatch(`Score ${scoreValue}`);
      });

      it(`should contain "Game over!" and "Your score is \${score}" if game status is "${
        tetrisConstants.GAME_STATUSES.END}"`, fakeAsync(() => {
        const scoreValue = 1000;
        tetrisService.gameStatusSubject.next(tetrisConstants.GAME_STATUSES.END);
        tetrisService.scoreSubject.next(scoreValue);

        tick(3000);
        fixture.detectChanges();
        const scoreResultEl = fixture.debugElement.query(By.css('#score-result'));

        expect(scoreResultEl.nativeElement.innerHTML).toMatch(/Game over!/);
        expect(scoreResultEl.nativeElement.innerText).toMatch(`Your score is ${scoreValue}`);
      }));
    });
  });

  describe('when called startGame()', () => {
    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    afterEach(() => {
      tetrisService = null;
      fixture.destroy();
      fixture = null;
      component = null;
    });

    it(`should be called tetriceService.startGame()`, () => {
      const startGameSpy = spyOn(tetrisService, 'startGame');
      const startGameBtnEl = fixture.debugElement.query(By.css('#start-game-btn'));
      startGameBtnEl.triggerEventHandler('click', null);

      expect(startGameSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when called continueGame()', () => {
    beforeEach(() => {
      tetrisService = TestBed.get(TetrisService);
      fixture = TestBed.createComponent(MenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    afterEach(() => {
      tetrisService = null;
      fixture.destroy();
      fixture = null;
      component = null;
    });

    it('should be called tetrisService.continueGame()', fakeAsync(() => {
      component.displayContinueGameBtn$ = true;
      fixture.detectChanges();

      const continueGameSpy = spyOn(tetrisService, 'continueGame');
      const continueBtnEl = fixture.debugElement.query(By.css('#continue-btn'));

      continueBtnEl.triggerEventHandler('click', null);

      expect(continueGameSpy).toHaveBeenCalled();
    }));
  });
});
