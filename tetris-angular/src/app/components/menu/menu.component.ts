import {Component, OnInit} from '@angular/core';
import {TetrisService} from '../../services/tetris.service';
import {Observable} from 'rxjs';
import TETRIS_CONSTANTS from '../../contants/tetrisConstants';
import {distinctUntilChanged, tap} from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  score$: Observable<number>;
  gameStatus$: Observable<string>;
  displayContinueGameBtn$ = false;

  GAME_STATUSES = TETRIS_CONSTANTS.GAME_STATUSES;

  constructor(private tetrisService: TetrisService) {}

  ngOnInit() {
    this.score$ = this.tetrisService.scoreSubject;
    this.gameStatus$ = this.tetrisService.gameStatusSubject
      .pipe(
        distinctUntilChanged(),
        tap(gameStatus => {
          this.displayContinueGameBtn$ = gameStatus === this.GAME_STATUSES.PAUSE;
        })
      );
  }

  continueGame() {
    this.tetrisService.continueGame();
  }

  startGame() {
    this.tetrisService.startGame();
  }
}
