import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import * as backend from './backend';

@Injectable({
  providedIn: 'root'
})
export class StreamDataService implements OnDestroy {
  private subjects: Map<string, ReplaySubject<string>> = new Map();
  private ws: WebSocketSubject<string>;
  private subscription: Subscription;

  constructor() {
    this.ws = webSocket({
      url: backend.wssAddress + '/stream',
      deserializer: (data) => this.deserialize(data),
      serializer: (data) => data,
    });
    this.subscription = this.ws.subscribe(
      msg => this.handleMessage(msg),
    );
    // Regularly check to see if we can close unused subjects.
    setInterval(() => this.checkSubscribersCallback(), 15000);
  }

  private deserialize(msg: MessageEvent<unknown>): string {
    if (typeof msg.data !== 'string') {
      throw new Error(`Received message with non-string data: ${msg.data}`);
    }
    return msg.data;
  }

  private handleMessage(msg: string) {
    const idParts: string[] = msg.split('/', 2);
    if (idParts.length !== 2) {
      throw new Error(`Could not find the two ID parts from data: ${msg}`);
    }
    const id: string = `${idParts[0]}/${idParts[1]}`;
    const prefixLength = idParts[0].length + idParts[1].length + 2;
    const data: string = msg.slice(prefixLength);

    const maybeSubject = this.subjects.get(id);
    if (maybeSubject === undefined) {
      console.warn(`Received data for unexpected ID: ${id}`);
      return;
    }
    const subj: ReplaySubject<string> = maybeSubject;
    subj.next(data);
  }

  private checkSubscribersCallback() {
    this.subjects.forEach((subj: ReplaySubject<string>, id: string) => {
      if (subj.observers.length === 0) {
        subj.complete();
        this.subjects.delete(id);
        this.ws.next('-' + id);
        console.log(`Closed unused subscription to ${id}`);
      }
    });
  }

  subscribe(datatype: string, dataId: string): Observable<string> {
    const id = `${encodeURIComponent(datatype)}/${encodeURIComponent(dataId)}`;
    const maybeSubj = this.subjects.get(id);
    if (maybeSubj) {
      const subj = maybeSubj;
      this.subjects.set(id, subj);
      return subj.asObservable();
    } 
    // Make the observable before subscribing so we don't miss any data.
    const subj: ReplaySubject<string> = new ReplaySubject(1);
    this.ws.next('+' + id);
    this.subjects.set(id, subj);
    return subj.asObservable();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
