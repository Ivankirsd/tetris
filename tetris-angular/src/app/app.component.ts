import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import TETRIS_CONSTANTS from './contants/tetrisConstants';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {TetrisService} from './services/tetris.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  menuIsOpen$: Observable<boolean>;

  constructor( private tetrisService: TetrisService ) {}

  ngOnInit() {
    this.menuIsOpen$ = this.tetrisService.gameStatusSubject
      .pipe(
        distinctUntilChanged(),
        map(gameStatus => gameStatus !== TETRIS_CONSTANTS.GAME_STATUSES.PLAY),
      );
  }

  @HostListener('window:keydown', ['$event'])
  moveFigureByPressedKey($event) {
    this.tetrisService.moveFigureByPressedKey($event.key);
  }
}
