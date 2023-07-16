import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  info(msg: any, functionName?: string, className?: string) {
    console.info(this.message(msg, functionName, className));
  }

  error(msg: any, functionName?: string, className?: string) {
    console.error(this.message(msg, functionName, className));
  }

  warn(msg: any, functionName?: string, className?: string) {
    console.warn(this.message(msg, functionName, className));
  }

  debug(msg: any, functionName?: string, className?: string) {
    console.debug(this.message(msg, functionName, className));
  }

  message(messageText: any, functionName?: string, className?: string) {
    return functionName == undefined || className == undefined ? messageText : `${className ? className : ''}::${
      functionName ? functionName : ''} - ${messageText}`;
  }
}
