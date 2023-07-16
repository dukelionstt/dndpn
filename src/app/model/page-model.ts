
import { TagMap } from './tag-map-model';

import { Tags } from './tags-model';

export interface Page {
  id: number;
  name: string;
  type: string;
  date: string;
  tags: Tags;
  page: any;
  tagReference?: number[];
  tagMap?: TagMap[];
  isOpen: boolean;
  lastSaved: string;
  saveUpToDate: boolean;

}
