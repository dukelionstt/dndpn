import { Tags } from './tags-model';

export interface Page {
  id: number;
  name: string;
  type: string;
  date: string;
  tags: Tags;
  page: any;
  isOpen: boolean;
}
