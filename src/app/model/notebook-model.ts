import { Page } from './page-model'

export interface NoteBook {
  id:number,
  name: string,
  type: string,
  date: Date,
  pages: Page[]
}
