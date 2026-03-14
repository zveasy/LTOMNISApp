// This file documents the native module interface.
// Android: Implement using ContentResolver to query SMS inbox
// iOS: Not applicable (no SMS access on iOS)
export interface OMNISSmsReaderInterface {
  readRecent(count: number): Promise<{body: string; date: number}[]>;
}
