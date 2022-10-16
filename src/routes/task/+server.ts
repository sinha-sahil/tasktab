import type { RequestEvent } from "@sveltejs/kit";
import { decodeCreateTaskRequest, type CreateTaskRequest } from "$lib/models/CreateTaskRequest";
import { createTask, updateTask } from "$lib/server/+server";
import { decodeUpdateTaskRequest, type UpdateTaskRequest } from "$lib/models/UpdateTaskRequest";

export async function POST(requestEvent: RequestEvent): Promise<Response> {
  try {
    const requestJSON = await requestEvent.request.json();
    const createTaskRequest: CreateTaskRequest | null = decodeCreateTaskRequest(requestJSON);
    if (createTaskRequest !== null) {
      const response = await createTask(createTaskRequest);
      if (response !== null) {
        return new Response('taskCreatedSuccessfully', { status: 200 });
      } else {
        return new Response('failedToCreateTask', { status: 400 });
      }
    } else{
      return new Response('incorrectPayload', { status: 400 });
    }
  } catch (error) {
    console.error('createTaskError', {error});
    return new Response('createTaskError', { status: 500 });
  }
}

export async function PATCH(requestEvent: RequestEvent): Promise<Response> {
  try {
    const requestJSON = await requestEvent.request.json();
    const updateTaskRequest: UpdateTaskRequest | null = decodeUpdateTaskRequest(requestJSON);
    if (updateTaskRequest !== null) {
      const response = await updateTask(updateTaskRequest);
      if (response !== null) {
        return new Response('taskUpdatedSuccessfully', { status: 200 });
      } else {
        return new Response('failedToUpdateTask', { status: 400 });
      }
    } else{
      return new Response('incorrectPayload', { status: 400 });
    }
  } catch (error) {
    console.error('updateTaskError', {error});
    return new Response('updateTaskError', { status: 500 });
  }
}
