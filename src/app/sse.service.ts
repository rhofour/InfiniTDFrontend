import { Injectable, NgZone } from "@angular/core";
import { Observable, Observer } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SseService {
  constructor(private _zone: NgZone) {}

  getServerSentEvent(url: string): Observable<unknown> {
    return new Observable((observer: Observer<unknown>) => {
      const eventSource = this.getEventSource(url);

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
        });
      };

      return function unsubscribe() {
        console.log("Closing event source for: " + url);
        eventSource.close();
      };
    });
  }

  private getEventSource(url: string): EventSource {
    return new EventSource(url);
  }
}

