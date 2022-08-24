import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  info(msg: any){
    console.info(msg)
  }

  error(msg: any){
    console.error(msg)
  }

  warn(msg: any){
    console.warn(msg)
  }

  debug(msg: any){
    console.debug(msg)
  }

}