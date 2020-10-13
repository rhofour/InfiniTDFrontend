import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { List } from 'immutable';


@Injectable({
  providedIn: 'root'
})
export class DebugService {
  messages$: BehaviorSubject<List<string>> = new BehaviorSubject(List());

  constructor() { }

  add(newMsg: string) {
    const currentMessages: List<string> = this.messages$.getValue()
    console.log(`Debug: ${newMsg}`);
    this.messages$.next(currentMessages.push(newMsg));
  }

  getMessages(): Observable<List<string>> {
    return this.messages$.asObservable();
  }

  reset(): void {
    this.messages$.next(List());
  }
}
