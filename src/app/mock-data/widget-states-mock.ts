import { ITEM, MISC, PERSON, PLACE } from '../constants';

export const WIDGET_STATES: Map<string, boolean> = new Map<string, boolean>([
  [PERSON, false],
  [PLACE, false],
  [ITEM, false],
  [MISC, false],
]);
