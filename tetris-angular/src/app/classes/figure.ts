import {FigureModel, FigureModelWithPositions} from '../models/types';

class Figure {
  public dX: number;
  public dY: number;
  protected figureModel: FigureModel;

  constructor() {
    this.dX = 6;
    this.dY = 0;
  }

  getFigureModel(): FigureModel {
    return this.figureModel;
  }

  setFigureModel(figureModel: FigureModel): void {
    if (!figureModel) {
      return;
    }
    this.figureModel = figureModel;
  }

  getFigurePosition(): FigureModelWithPositions {
    const midX = Math.floor(this.figureModel[0].length / 2);
    const midY = Math.floor(this.figureModel.length / 2);

    return this.figureModel.map((row, i) => {
      return row.map((cell, j) => {
        return cell ? [
          i - midY + this.dY,
          j - midX + this.dX
        ] : null;
      });
    });
  }

  moveLeft(): void {
    this.dX--;
  }

  moveRight(): void {
    this.dX++;
  }

  moveDown(): void {
    this.dY++;
  }

  flip(): void {
    const flipperFigureModel: FigureModel = [];
    const figureYLength = this.figureModel.length;

    this.figureModel.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (i === 0) {
          flipperFigureModel.push([this.figureModel[figureYLength - 1 - i][j]]);
        } else {
          flipperFigureModel[j].push(this.figureModel[figureYLength - 1 - i][j]);
        }
      });
    });
    this.figureModel = flipperFigureModel;
  }
}

class Figure1 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1, null],
      [null, 1, 1]
    ];
  }
}

class Figure2 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [null, 1, 1],
      [1, 1, null]
    ];
  }
}

class Figure3 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1, 1],
      [null, 1, null]
    ];
  }
}

class Figure4 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1],
      [1, 1]
    ];
  }

  flip(): void {
  }
}

class Figure5 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1, 1, 1]
    ];
  }
}

class Figure6 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1, 1],
      [1, null, null]
    ];
  }
}

class Figure7 extends Figure {
  constructor() {
    super();
    this.figureModel = [
      [1, 1, 1],
      [null, null, 1]
    ];
  }
}

export {
  Figure,
  Figure1,
  Figure2,
  Figure3,
  Figure4,
  Figure5,
  Figure6,
  Figure7,
};
