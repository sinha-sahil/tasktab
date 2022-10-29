import { decodeTask, type Task } from "./Task";
import { decodeArray, decodeBoolean, decodeNumber, isJSON, noErrorOrNullValues, _decodeString } from "../utils/decoders";

export interface CreateTaskListRequest {
  name: string;
  priority : number;
  isArchived : boolean;
  completed: boolean;
  tasks: Array<Task>;
}

export function decodeCreateTaskListRequest(rawInput: any) : CreateTaskListRequest | null {
  if(isJSON(rawInput)){
    const decodeName = _decodeString(rawInput['name']);
    const decodedIsArchived = decodeBoolean(rawInput['isArchived']);
    const decodedCompleted = decodeBoolean(rawInput['completed']);
    const decodedPriority = decodeNumber(rawInput['priority']);
    const decodedTasks = decodeArray(rawInput['tasks'], decodeTask);
    if( decodedIsArchived !== null && decodedPriority !== null  && decodeName !== null && decodedCompleted !== null && decodedTasks !== null){
      const decodedResponse: CreateTaskListRequest = {
        name: decodeName,
        priority : decodedPriority,
        isArchived : decodedIsArchived,
        completed: decodedCompleted,
        tasks: decodedTasks
      }
      if (noErrorOrNullValues(decodedResponse)) {
        return decodedResponse;
      }
    }

  }
  return null;
}
