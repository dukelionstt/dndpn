import { NoteBook } from '../model/notebook-model';
import { PAGE } from './page-mock';
import { PAGE_2 } from './page2-mock';
import { TAG_LIST } from './tag-mock';

export const NOTEBOOK: NoteBook = {
  id: 1,
  name: 'testing Notebook',
  date: new Date().getDate().toString(),
  type: 'DND',
  pages: [PAGE, PAGE_2],
  saveLocation: 'E:\\backup\\dndpn\\src\\app\\mock-data\\page-mock.json',
  tagList: TAG_LIST
};
