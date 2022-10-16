import type { RequestEvent } from "@sveltejs/kit";
import { decodeCreateTaskListRequest, type CreateTaskListRequest } from "$lib/models/CreateTaskListRequest";
import { createTaskList } from "$lib/server/+server";
import { decodeUpdateTaskListRequest, type UpdateTaskListRequest } from "$lib/models/UpdateTaskListRequest";
import { updateTaskList } from "$lib/server/+server";

export async function POST(requestEvent: RequestEvent): Promise<Response> {
  try {
    const requestJSON = await requestEvent.request.json();
    const createTaskListRequest: CreateTaskListRequest | null = decodeCreateTaskListRequest(requestJSON);
    if (createTaskListRequest !== null) {
      const response = await createTaskList(createTaskListRequest);
      if (response !== null) {
        return new Response('tasklistCreatedSuccessfully', { status: 200 });
      } else {
        return new Response('failedToCreateTaskList', { status: 400 });
      }
    } else {
      return new Response('incorrectPayload', { status: 400 });
    }
  } catch (error) {
    console.error('createNewTaskListError', { error });
    return new Response('createNewTaskListError', { status: 500 });
  }
}

export async function PATCH(requestEvent: RequestEvent): Promise<Response> {
  try {
    const requestJSON = await requestEvent.request.json();
    const updateTaskListRequest: UpdateTaskListRequest | null = decodeUpdateTaskListRequest(requestJSON);
    if (updateTaskListRequest !== null) {
      const response = await updateTaskList(updateTaskListRequest);
      if (response !== null) {
        return new Response('tasklistUpdatedSuccessfully', { status: 200 });
      } else {
        return new Response('failedToUpdateTaskList', { status: 400 });
      }

    } else {
      return new Response('incorrectPayload', { status: 400 });
    }
  } catch (error) {
    console.error('updateTaskListError', { error });
    return new Response('updateTaskListError', { status: 500 });
  }
}
