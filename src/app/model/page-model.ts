import { Tags } from './tags-model';

export interface Page {
  id: number;
  name: string;
  date: string;
  tags: Tags;
  page: any;
  isOpen: boolean;
  lastSaved: string;
  saveUpToDate: boolean;
}
