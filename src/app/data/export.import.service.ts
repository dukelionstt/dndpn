import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger.service';
import { ExportConents } from '../model/export.contetns-model';

const BASEURL: string = 'http://localhost:8081/api';

@Injectable({
  providedIn: 'root',
})
export class ExportImportService {
  private exportURL: string = BASEURL + '/export';

  constructor(private http: HttpClient, private log: LoggerService) {}

  export(contents: ExportConents[]): Observable<any> {
    this.log.info(
      `export service for ${
        contents.length > 1 ? contents.length + ' Pages' : contents[0].pageName
      }  called`
    );
    return this.http.post<any>(this.exportURL, contents);
  }

  import(fileName: string, content: string) {
    this.log.info(`save file service for ${fileName} called`);
    return this.http.post<any>(this.exportURL + 'save', {
      fileContent: content,
      fileName: fileName,
    });
  }
}
