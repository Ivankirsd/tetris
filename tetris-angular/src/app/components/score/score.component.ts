import {Component, OnInit} from '@angular/core';
import {Figure} from '../../services/figure.service';
import {TetrisService} from '../../services/tetris.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent implements OnInit {
  score$: BehaviorSubject<number> = null;
  figures$: BehaviorSubject<Figure[]>;

  constructor(
    private tetrisService: TetrisService,
  ) {}

  ngOnInit() {
    this.score$ = this.tetrisService.scoreSubject;
    this.figures$ = this.tetrisService.figuresArraySubject;
  }

  pauseGame() {
    this.tetrisService.pauseGame();
  }

}
