import {Component, OnInit} from '@angular/core';
import {TetrisService} from '../../services/tetris.service';
import {Observable} from 'rxjs/internal/Observable';
import {Figure} from '../../classes/figure';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  score$: Observable<number> = null;
  figures$: Observable<Figure[]>;

  constructor(private tetrisService: TetrisService) {}

  ngOnInit() {
    this.score$ = this.tetrisService.scoreSubject;
    this.figures$ = this.tetrisService.figuresArraySubject;
  }

  pauseGame() {
    this.tetrisService.pauseGame();
  }

  trackByFn(index: number): number {
    return index;
  }
}
