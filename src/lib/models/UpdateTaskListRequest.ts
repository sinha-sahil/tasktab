import { decodeTask, type Task } from "./Task";
import { decodeArray, decodeBoolean, decodeNumber, isJSON, noErrorOrNullValues, _decodeString } from "../utils/decoders";

export interface UpdateTaskListRequest {
  id: string;
  name: string | null;
  priority: number | null;
  isArchived: boolean | null;
  completed: boolean | null;
  tasks: Array<Task> | null;
}

export function decodeUpdateTaskListRequest(rawInput: any): UpdateTaskListRequest | null {
  if (isJSON(rawInput)) {
    const decodedId = _decodeString(rawInput['id']);
    const decodedName = _decodeString(rawInput['name']);
    const decodedIsArchived = decodeBoolean(rawInput['isArchived']);
    const decodedCompleted = decodeBoolean(rawInput['completed']);
    const decodedPriority = decodeNumber(rawInput['priority']);
    const decodedTasks = decodeArray(rawInput['tasks'], decodeTask);
    if (decodedId !== null) {
      const decodedResponse: UpdateTaskListRequest = {
        id: decodedId,
        name: decodedName,
        priority: decodedPriority,
        isArchived: decodedIsArchived,
        completed: decodedCompleted,
        tasks: decodedTasks
      }
      if (noErrorOrNullValues(decodedResponse, ['name', 'priority', 'isArchived', 'completed', 'tasks'])) {
        return decodedResponse;
      }
    }

  }
  return null;
}
