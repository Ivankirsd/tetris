import {Component, Input, OnInit} from '@angular/core';
import {FigureModel} from '../../../models/types';
import {Figure} from '../../../classes/figure';

@Component({
  selector: 'app-figure',
  templateUrl: './figure.component.html',
  styleUrls: ['./figure.component.scss']
})
export class FigureComponent {
  figureModel: FigureModel;

  @Input() set figure(figure: Figure) {
    this.figureModel = figure.getFigureModel();
  }

  constructor() {}

  trackByRowFn(index: number): number {
    return index;
  }

  trackByCellFn(index: number, item: number): string {
    return `${index}_${item}`;
  }
}
