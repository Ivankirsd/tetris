import {Injectable} from '@angular/core';
import {Figure, Figure1, Figure2, Figure3, Figure4, Figure5, Figure6, Figure7} from '../classes/figure';

@Injectable({
  providedIn: 'root'
})
export class FigureService {

  constructor() {}

  public generateRandomFigure(): Figure {
    const randomFigureNumber = this.random(1, 7);
    const startFlip = this.random(0, 3);
    let figure: Figure = null;

    switch (randomFigureNumber) {
      case 1: {
        figure = new Figure1();
        break;
      }
      case 2: {
        figure = new Figure2();
        break;
      }
      case 3: {
        figure = new Figure3();
        break;
      }
      case 4: {
        figure = new Figure4();
        break;
      }
      case 5: {
        figure = new Figure5();
        break;
      }
      case 6: {
        figure = new Figure6();
        break;
      }
      case 7: {
        figure = new Figure7();
        break;
      }
      default: {
        throw Error('Unknown Figure type');
      }
    }

    for (let i = 0; i < startFlip; i++) {
      figure.flip();
    }
    return figure;
  }

  private random(min = 0, max = 1): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
