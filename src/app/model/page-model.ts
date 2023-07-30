
import { TagMap } from './tag-map-model';

import { Tags } from './tags-model';

export interface Page {
  id: number;
  name: string;
  date: string;
  tags: Tags;
  page: any;
  tagRanges: number[];
  tagMap: Map<string, TagMap>;
  isOpen: boolean;
  lastSaved: string;
  saveUpToDate: boolean;

}
