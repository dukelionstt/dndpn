import { NoteBook } from "../model/notebook-model";
import { PAGE } from "./page-mock";

export const NOTEBOOK: NoteBook = {
id: 1,
name: "teseting Notebook",
date: Date.now.toString(),
type: 'DND',
pages: [PAGE],
pagesLocation: ["E:/backup/dndpn/src/app/mock-data/page-mock.json"]
}
