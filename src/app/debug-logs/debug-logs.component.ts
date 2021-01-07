import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';

import { LogEntry } from '../log-entry';
import * as decoders from '../decode';
import * as backend from '../backend';

@Component({
  selector: 'app-debug-logs',
  templateUrl: './debug-logs.component.html',
  styleUrls: ['./debug-logs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DebugLogsComponent {
  public logs$: Observable<LogEntry[]> = EMPTY;
  public displayedColumns = ['time', 'uid', 'requestId', 'handler', 'msg', 'verbosity'];
  minVerbosity = "-";
  maxVerbosity = "-";

  constructor(
    private http: HttpClient,
  ) {
    this.updateLogs();
  }

  public updateLogs() {
    let params = new HttpParams();
    if (this.minVerbosity !== "-") {
      params = params.set("minVerbosity", this.minVerbosity);
    }
    if (this.maxVerbosity !== "-") {
      params = params.set("maxVerbosity", this.maxVerbosity);
    }
    this.logs$ = this.http.get(backend.address + '/debug/logs', {params: params}).pipe(
      map(resp => decoders.logEntries.decode(resp)),
      map(decodedLogEntries => {
        console.log(decodedLogEntries);
        if (decodedLogEntries.isOk()) {
          return decodedLogEntries.value.logs;
        }
        return [];
      }),
    )
  }

}
