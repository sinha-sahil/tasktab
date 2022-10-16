import { type State, decodeState } from "./Task";
import { decodeArray, decodeBoolean, decodeNumber, isJSON, noErrorOrNullValues, _decodeString } from "../utils/decoders";

export interface UpdateTaskRequest {
  id: string;
  serialNumber: number | null;
  taskListId: string | null;
  title: string | null;
  content: string | null;
  isArchived: boolean | null;
  priority: number | null;
  labels: Array<string> | null;
  state: State | null;
}

export function decodeUpdateTaskRequest(rawInput: any): UpdateTaskRequest | null {
  if (isJSON(rawInput)) {
    const decodedId = _decodeString(rawInput['id']);
    if (decodedId !== null) {
      const decodedResponse: UpdateTaskRequest = {
        id: decodedId,
        serialNumber: decodeNumber(rawInput['serialNumber']),
        taskListId: _decodeString(rawInput['taskListId']),
        title: _decodeString(rawInput['title']),
        content: _decodeString(rawInput['content']),
        isArchived: decodeBoolean(rawInput['isArchived']),
        priority: decodeNumber(rawInput['priority']),
        labels: decodeArray(rawInput['labels'], _decodeString),
        state: decodeState(rawInput['state'])
      }
      const nullableKeys = [
        'serialNumber', 'taskListId', 'title',
        'content', 'isArchived', 'priority',
        'labels', 'state'
      ]
      if (noErrorOrNullValues(decodedResponse, nullableKeys)) {
        return decodedResponse;
      }
    }
  }
  return null;
}
