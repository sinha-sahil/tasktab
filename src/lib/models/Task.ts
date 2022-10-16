import { decodeArray, decodeBoolean, decodeDate, decodeNumber, decodeString, isJSON, noErrorOrNullValues, _decodeString } from "../utils/decoders";

export type State = 'BackLog' | 'Started' | 'Paused' | 'Completed' | 'Discarded';

export function decodeState(rawInput: any): State | null {
  if (typeof rawInput === 'string' && (rawInput === 'BackLog' || rawInput === 'Started' || rawInput === 'Paused' || rawInput === 'Completed' || rawInput === 'Discarded')) {
    return rawInput;
  }
  return null;
}

export interface Task {
  id: string;
  taskListId: string;
  serialNumber: number;
  title: string;
  content: string;
  isArchived: boolean;
  priority: number;
  labels: Array<string>;
  state: State;
  timeTaken: number;
  createdAt: Date;
  updatedAt: Date;
}

export function decodeTask(rawinput: any): Task | null {
  if (isJSON(rawinput)) {
    const decodedSerialNumber = decodeNumber(rawinput['serialNumber']);
    const decodedIsArchived = decodeBoolean(rawinput['isArchived']);
    const decodedPriority = decodeNumber(rawinput['priority']);
    const decodedTimeTaken = decodeNumber(rawinput['timeTaken']);
    const decodedCreatedAt = decodeDate(rawinput['createdAt']);
    const decodedUpdatedAt = decodeDate(rawinput['updatedAt']);
    const decodedState = decodeState(rawinput['state']);
    const decodedLabels = decodeArray(rawinput['labels'], _decodeString);
    if (decodedSerialNumber !== null && decodedIsArchived !== null && decodedPriority !== null && decodedTimeTaken !== null && decodedCreatedAt !== null && decodedUpdatedAt !== null && decodedState !== null && decodedLabels !== null) {
      const decodedResponse: Task = {
        id: decodeString(rawinput['id']),
        taskListId: decodeString(rawinput['taskListId']),
        serialNumber: decodedSerialNumber,
        title: decodeString(rawinput['title']),
        content: decodeString(rawinput['content']),
        isArchived: decodedIsArchived,
        priority: decodedPriority,
        labels: decodedLabels,
        state: decodedState,
        timeTaken: decodedTimeTaken,
        createdAt: decodedCreatedAt,
        updatedAt: decodedUpdatedAt
      }
      if (noErrorOrNullValues(decodedResponse)) {
        return decodedResponse;
      }
    }

  }
  return null;
}


