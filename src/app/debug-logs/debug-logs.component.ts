import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

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
export class DebugLogsComponent implements OnInit {
  public logs$: Observable<LogEntry[]> = EMPTY;
  public displayedColumns = ['time', 'uid', 'requestId', 'handler', 'msg', 'verbosity'];

  constructor(
    private http: HttpClient,
  ) {
    this.logs$ = this.http.get(backend.address + '/debug/logs').pipe(
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

  ngOnInit(): void {
  }

}
