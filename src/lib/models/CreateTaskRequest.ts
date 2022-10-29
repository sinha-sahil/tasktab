import { decodeArray, decodeBoolean, decodeNumber, decodeString, isJSON, noErrorOrNullValues, _decodeString } from "../utils/decoders";
import { type State, decodeState } from "./Task";

export interface CreateTaskRequest {
  taskListId: string;
  title: string;
  content: string;
  isArchived: boolean;
  priority: number;
  labels: Array<string>;
  state: State;
}

export function decodeCreateTaskRequest(rawinput: any): CreateTaskRequest | null {
  if (isJSON(rawinput)) {
    const decodedIsArchived = decodeBoolean(rawinput['isArchived']);
    const decodedPriority = decodeNumber(rawinput['priority']);
    const decodedState = decodeState(rawinput['state']);
    const decodedLabels = decodeArray(rawinput['labels'], _decodeString);
    if (decodedIsArchived !== null && decodedPriority !== null && decodedState !== null && decodedLabels !== null) {
      const decodedResponse: CreateTaskRequest = {
        taskListId: decodeString(rawinput['taskListId']),
        title: decodeString(rawinput['title']),
        content: decodeString(rawinput['content']),
        isArchived: decodedIsArchived,
        priority: decodedPriority,
        labels: decodedLabels,
        state: decodedState
      }
      if (noErrorOrNullValues(decodedResponse)) {
        return decodedResponse;
      }
    }

  }
  return null;
}
