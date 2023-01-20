import { ITEM, MISC, PERSON, PLACE } from '../constants';

export const WIDGET_STATES: Map<string, boolean> = new Map<string, boolean>([
  [PERSON, true],
  [PLACE, true],
  [ITEM, true],
  [MISC, true],
]);
