import type { Task } from "./Task";

export interface TaskList {
  id: string;
  name: string;
  priority: number;
  isArchived: boolean;
  completed: boolean;
  tasks: Array<Task>;
}


