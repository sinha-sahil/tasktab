import type { CreateTaskListRequest } from "$lib/models/CreateTaskListRequest";
import type { TaskList } from "$lib/models/TaskList";
import type { Task } from "$lib/models/Task";
import type { CreateTaskRequest } from "$lib/models/CreateTaskRequest";
import type { UpdateTaskListRequest } from "$lib/models/UpdateTaskListRequest";
import type { UpdateTaskRequest } from "$lib/models/UpdateTaskRequest";
import { nanoid } from 'nanoid';

let taskLists: Array<TaskList> = [];

export async function getTaskListById(taskListId: string): Promise<TaskList | null> {
  let result: TaskList | null = null;
  const taskList: TaskList | undefined = taskLists.find(currentTaskList => currentTaskList.id === taskListId);
  if (taskList) {
    result = taskList;
  }
  console.log({ taskLists });
  return result;
}

export async function createTaskList(createTaskListRequest: CreateTaskListRequest): Promise<TaskList | null> {
  const taskList: TaskList = {
    id: nanoid(),
    ...createTaskListRequest
  }
  taskLists.push(taskList);
  console.log({ taskLists });
  return taskList;
}

export async function createTask(createTaskRequest: CreateTaskRequest): Promise<Task | null> {
  const taskListId = createTaskRequest.taskListId;
  const taskList: TaskList | null = await getTaskListById(taskListId);
  const date = new Date();
  if (taskList !== null) {
    const task: Task = {
      ...createTaskRequest,
      id: nanoid(),
      serialNumber: taskList.tasks.length + 1,
      timeTaken: 1,
      createdAt: date,
      updatedAt: date
    }
    taskList.tasks.push(task);
    console.log({ taskLists });
    return task;
  }
  console.log({ taskLists });
  return null;
}

export async function updateTaskList(updateTaskListRequest: UpdateTaskListRequest): Promise<TaskList | null> {
  let updatedTaskList: TaskList | null = null;
  taskLists = taskLists.map(currentTaskList => {
    if (currentTaskList.id === updateTaskListRequest.id) {
      updatedTaskList = {
        ...currentTaskList,
        name: updateTaskListRequest.name !== null ? updateTaskListRequest.name : currentTaskList.name,
        priority: updateTaskListRequest.priority !== null ? updateTaskListRequest.priority : currentTaskList.priority,
        isArchived: updateTaskListRequest.isArchived !== null ? updateTaskListRequest.isArchived : currentTaskList.isArchived,
        completed: updateTaskListRequest.completed !== null ? updateTaskListRequest.completed : currentTaskList.completed,
        tasks: updateTaskListRequest.tasks !== null ? updateTaskListRequest.tasks : currentTaskList.tasks
      }
      return updatedTaskList;
    } else {
      return currentTaskList;
    }
  });
  console.log({ taskLists });
  return updatedTaskList;
}

export async function updateTask(updateTaskRequest: UpdateTaskRequest): Promise<Task | null> {
  let updatedTaskResult: Task | null = null;
  taskLists.forEach(taskList => {
    taskList.tasks.find(currentTask => {
      if (currentTask.id === updateTaskRequest.id) {
        updatedTaskResult = {
          ...currentTask,
          updatedAt: new Date(),
          serialNumber: updateTaskRequest.serialNumber !== null ? updateTaskRequest.serialNumber : currentTask.serialNumber,
          taskListId: updateTaskRequest.taskListId !== null ? updateTaskRequest.taskListId : currentTask.taskListId,
          title: updateTaskRequest.title !== null ? updateTaskRequest.title : currentTask.title,
          content: updateTaskRequest.content !== null ? updateTaskRequest.content : currentTask.content,
          isArchived: updateTaskRequest.isArchived !== null ? updateTaskRequest.isArchived : currentTask.isArchived,
          priority: updateTaskRequest.priority !== null ? updateTaskRequest.priority : currentTask.priority,
          labels: updateTaskRequest.labels !== null ? updateTaskRequest.labels : currentTask.labels,
          state: updateTaskRequest.state !== null ? updateTaskRequest.state : currentTask.state
        }
        return updatedTaskResult;
      } else {
        return currentTask;
      }
    });
  });
  console.log({ taskLists });
  return updatedTaskResult;
}
