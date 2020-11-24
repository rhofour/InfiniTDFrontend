export interface LogEntryContainer {
  logs: LogEntry[],
}

export interface LogEntry {
  time: string,
  uid: string
  requestId: number,
  handler: string,
  msg: string,
  verbosity: number,
}
