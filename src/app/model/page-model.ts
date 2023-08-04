import { TagMap } from './tag-map-model';

import { Tags } from './tags-model';
import { Word } from './word.model';

export interface Page {
  id: number;
  name: string;
  date: string;
  tags: Tags;
  page: string;
  tagRanges: number[];
  tagMap: Map<string, TagMap>;
  wordMap: Word[];
  isOpen: boolean;
  lastSaved: string;
  saveUpToDate: boolean;
}
