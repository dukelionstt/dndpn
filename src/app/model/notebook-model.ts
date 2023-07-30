import { Page } from './page-model'
import { Tag } from './tag-model'

export interface NoteBook {
  id:number,
  name: string,
  type: string,
  date: string,
  pages: Page[],
  saveLocation: string
  tagList: Tag[]
}
