import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger.service';

const BASEURL: string = "http://localhost:8081/api"

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private fileURL: string = BASEURL + "/file/"

  constructor(private http: HttpClient, private log: LoggerService) { }

  getFile(fileName: string): Observable<any> {
    this.log.info(`get file service for ${fileName} called`)
    return this.http.post<any>(this.fileURL + "get", {fileName: fileName})
  }

  saveFile(fileName: string, content:string){
    this.log.info(`save file service for ${fileName} called`)
    return this.http.post<any>(this.fileURL+"save",  {fileContent: content, fileName:fileName});
  }
}
