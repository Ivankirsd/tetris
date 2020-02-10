import {GameStatus} from '../models/types';

const GAME_STATUSES: {[key: string]: GameStatus} = Object.freeze({
  START: 'start',
  PLAY: 'play',
  PAUSE: 'pause',
  END: 'end'
});
const PLAYING_AREA_SYZE_X = 12;
const PLAYING_AREA_SYZE_Y = 20;

export default {
  GAME_STATUSES,
  PLAYING_AREA_SYZE_X,
  PLAYING_AREA_SYZE_Y,
};
