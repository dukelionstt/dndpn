import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoggerService } from '../logger.service';
import { NOTEBOOK } from '../mock-data/notebook-mock';
// import { ipcRenderer } from 'electron'


@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  // notebookPath: string = __dirname + 'src/app/mock-data/notebook-mock.json';

  getNoteBook(){

    let noteBook: any;

    // fetch("E:/backup/dndpn/src/app/mock-data/notebook-mock.json")
    // .then(responce => responce.text())
    // .then(data => {
    //   this.log.debug(data);
    //   noteBook = data
    // })
    this.log.debug("calling api")
    this.log.debug(this.http.get<string>("https://localhost:8081/test"));
    this.log.debug("api called")

    return NOTEBOOK
  }

  constructor(private log: LoggerService, private http: HttpClient) { 
  }
}
