import {Injectable} from '@angular/core';
import TETRIS_CONSTANTS from '../contants/tetrisConstants';
import {FigureModel, FigureModelWithPositions, PlayingArea} from '../models/types';
import {Figure} from '../classes/figure';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() {}

  public generatePlayingArea(
    syzeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X,
    syzeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y
  ): PlayingArea {
    return Array(syzeY).fill(null).map(() => {
      return Array(syzeX).fill(null);
    });
  }

  public removeFullRowFromPlayingArea(playingArea: PlayingArea, index: number): void {
    if (!this.playingAreaIsValid(playingArea)) {
      throw Error(`RemoveFullRowFromPlayingArea() executed with error. PlayingArea param is invalid. PlayingArea param is ${playingArea}`);
    }

    if (!Number.isInteger(index) || index < 0 || index > playingArea.length - 1) {
      throw Error(`Index is invalid. Index = ${index}`);
    }

    const rowLength = playingArea[0].length;
    const newRow = Array(rowLength).fill(null);

    playingArea.splice(index, 1);
    playingArea.unshift(newRow);
  }

  public canSetFigureToPlayingArea(
    playingArea: PlayingArea,
    positionX: number = null,
    positionY: number = null,
    figureModel: FigureModel
  ): boolean {

    if (
      !this.playingAreaIsValid(playingArea) ||
      !Number.isFinite(positionX) ||
      !Number.isFinite(positionY) ||
      !this.figureModelIsValid(figureModel)
    ) {
      return false;
    }

    const midX = Math.floor(figureModel[0].length / 2);
    const midY = Math.floor(figureModel.length / 2);

    return figureModel.every((row, i) => {
      return row.every((cell, j) => {
        if (!cell || i + positionY - midY < 0) {
          return true;
        }
        return !(
          (i + positionY - midY < 0) ||
          (i + positionY - midY > playingArea.length - 1) ||
          (j + positionX - midX < 0) ||
          (j + positionX - midX > playingArea[0].length - 1) ||
          (playingArea[i + positionY - midY][j + positionX - midX] !== null)
        );
      });
    });

  }

  private setFigureToPlayingArea(playingArea: PlayingArea, figureModel: FigureModelWithPositions): void {
    if (
      !this.playingAreaIsValid(playingArea) ||
      !this.figureModelIsValid(figureModel)
    ) {
      return;
    }

    figureModel.forEach(row => {
      row.forEach((cell) => {
        if (cell && cell[0] > -1) {
          playingArea[cell[0]][cell[1]] = 1;
        }
      });
    });
  }

  public flipFigure(playingArea: PlayingArea, focusedFigure: Figure): boolean {
    if (
      !this.playingAreaIsValid(playingArea) ||
      !focusedFigure ||
      !(focusedFigure instanceof Figure)
    ) {
      return false;
    }

    const oldFigure: FigureModel = focusedFigure.getFigureModel();
    focusedFigure.flip();
    const flippedFigure: FigureModel = focusedFigure.getFigureModel();

    if (!this.canSetFigureToPlayingArea(playingArea, focusedFigure.dX, focusedFigure.dY, flippedFigure)) {
      const midX = Math.floor(flippedFigure[0].length / 2);

      for (let i = 1; i < midX + 1; i++) {
        if (this.canSetFigureToPlayingArea(playingArea, focusedFigure.dX - midX + i - 1, focusedFigure.dY, flippedFigure)) {
          focusedFigure.dX -= i;
          return true;
        }
        if (this.canSetFigureToPlayingArea(playingArea, focusedFigure.dX + i, focusedFigure.dY, flippedFigure)) {
          focusedFigure.dX += i;
          return true;
        }
      }
      focusedFigure.setFigureModel(oldFigure);
      return false;
    }
    return true;
  }

  public moveFigureDown(playingArea: PlayingArea, focusedFigure: Figure): boolean {
    if (!this.playingAreaIsValid(playingArea)) {
      throw Error(`moveFigureDown() executed with error. PlayingArea param is invalid. PlayingArea param is ${playingArea}`);
    }

    if (!focusedFigure || !(focusedFigure instanceof Figure)) {
      throw Error(`Figure param is invalid. Figure is ${focusedFigure}`);
    }

    if (
      this.canSetFigureToPlayingArea(
        playingArea, focusedFigure.dX,
        focusedFigure.dY + 1,
        focusedFigure.getFigureModel()
      )
    ) {
      focusedFigure.moveDown();
      return true;
    } else {
      this.setFigureToPlayingArea(playingArea, focusedFigure.getFigurePosition());
      return false;
    }
  }

  public moveFigureLeft(playingArea: PlayingArea, focusedFigure: Figure): boolean {
    if (!this.playingAreaIsValid(playingArea)) {
      throw Error(`moveFigureLeft() executed with error. PlayingArea param is invalid. PlayingArea param is ${playingArea}`);

    }

    if (!focusedFigure || !(focusedFigure instanceof Figure)) {
      throw Error(`Figure param is invalid. Figure is ${focusedFigure}`);
    }

    if (
      this.canSetFigureToPlayingArea(
        playingArea,
        focusedFigure.dX - 1,
        focusedFigure.dY,
        focusedFigure.getFigureModel()
      )
    ) {
      focusedFigure.moveLeft();
      return true;
    }
    return false;
  }

  public moveFigureRight(playingArea: PlayingArea, focusedFigure: Figure): boolean {
    if (!this.playingAreaIsValid(playingArea)) {
      throw Error(`moveFigureRight() executed with error. PlayingArea param is invalid. PlayingArea param is ${playingArea}`);

    }

    if (!focusedFigure || !(focusedFigure instanceof Figure)) {
      throw Error(`Figure param is invalid. Figure is ${focusedFigure}`);
    }

    if (this.canSetFigureToPlayingArea(
      playingArea,
      focusedFigure.dX + 1,
      focusedFigure.dY,
      focusedFigure.getFigureModel()
    )) {
      focusedFigure.moveRight();
      return true;
    }
    return false;
  }

  private playingAreaIsValid(playingArea: PlayingArea): boolean {
    return !(
      !playingArea ||
      !Array.isArray(playingArea) ||
      playingArea.length === 0 ||
      !Array.isArray(playingArea[0]) ||
      playingArea[0].length === 0
    );
  }

  private figureModelIsValid(figureModel: FigureModel | FigureModelWithPositions): boolean {
    return !(
      !figureModel ||
      !Array.isArray(figureModel) ||
      figureModel.length === 0 ||
      !Array.isArray(figureModel[0]) ||
      figureModel[0].length === 0
    );
  }
}
