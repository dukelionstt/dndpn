import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { LoggerService } from '../logger.service';
import { NOTEBOOK } from '../mock-data/notebook-mock';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotebookService {
  // notebookPath: string = __dirname + 'src/app/mock-data/notebook-mock.json';

  getNoteBook(): Observable<any> {
    console.log("setting api")
    return this.http.post<any>("https://putsreq.com/QBHL6qYUM0QANvDakaPG", {name: "Smeg Head"})

    // return NOTEBOOK
  }

  constructor(private log: LoggerService, private http: HttpClient) {
  }

  callAPi(){
    this.notePadServer.getSomething().subscribe(data => {
      console.log("api called")
      console.log(`api content ${data.message}`)
      console.log('api finished')
    })
  }
}
