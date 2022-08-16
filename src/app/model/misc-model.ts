import { MetaData } from "./meta-data-model"

export interface Misc {
  id: number,
  name:string,
  date: string,
  notes: string,
  misc: string[]
  metaData: MetaData
}

