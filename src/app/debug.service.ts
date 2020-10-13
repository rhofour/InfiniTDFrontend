import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  messages: string[] = [];

  constructor() { }

  add(newMsg: string) {
    this.messages.push(newMsg);
  }

  getMessages(): string[] {
    return this.messages;
  }
}
