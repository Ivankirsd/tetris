import {Injectable} from '@angular/core';
import TETRIS_CONSTANTS from '../contants/tetrisConstants';
import {Figure} from './figure.service';
import {FigureModel, FigureModelWithPositions, PlayingArea} from '../models/types';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor() {
  }

  public generatePlayingArea(
    syzeX = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_X,
    syzeY = TETRIS_CONSTANTS.PLAYING_AREA_SYZE_Y
  ): PlayingArea {
    return Array(syzeY).fill(null).map(() => {
      return Array(syzeX).fill(null);
    });
  }

  public removeFullRowFromPlayingArea(playingArea: PlayingArea, index: number): void {
    if (!playingArea || index < 0 || index > playingArea.length) {
      return;
    }

    playingArea.splice(index, 1);
    const rowLength = playingArea[0].length;

    const newRow = Array(rowLength).fill(null);
    playingArea.unshift(newRow);
  }

  public canSetFigureToPlayingArea(
    playingArea: PlayingArea,
    positionX: number = null,
    positionY: number = null,
    figureModel: FigureModel
  ): boolean {
    if (!playingArea || positionX === null || positionY === null || !figureModel) {
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
    if (!playingArea || !figureModel) {
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
    if (!playingArea || !focusedFigure) {
      return;
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
    if (!playingArea) {
      throw Error(`playingArea is ${playingArea}.`);
    }

    if (!focusedFigure) {
      throw Error(`focusedFigure is ${focusedFigure}.`);
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
    if (!playingArea || !focusedFigure) {
      return false;
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
    if (!playingArea || !focusedFigure) {
      return false;
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

}
