import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PlayingArea} from '../../models/types';
import {TetrisService} from '../../services/tetris.service';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  playingAreaWithFigure$: Observable<PlayingArea>;

  constructor(private tetrisService: TetrisService) {}

  ngOnInit() {
    this.playingAreaWithFigure$ = this.tetrisService.playingAreaWithFigureSubject
      .pipe(
        filter(([playingArea, figure]) => (!!playingArea && !!figure)),
        map(([playingArea, figure]) => {
          const clonePlayingArea = playingArea.map(row => [...row]);

          const fig = figure.getFigurePosition();

          fig.forEach(row => {
            row.forEach(cell => {
              if (cell && cell[0] > -1) {
                clonePlayingArea[cell[0]][cell[1]] = 2;
              }
            });
          });
          return clonePlayingArea;
        })
      );
  }

  trackByRowFn(index: number): number {
    return index;
  }

  trackByCellFn(index: number, item: number): string {
    return `${index}_${item}`;
  }
}
