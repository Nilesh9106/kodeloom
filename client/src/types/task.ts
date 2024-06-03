import { User } from "./auth";
import { Label, Project } from "./project";

export interface Task {
  _id?: string;
  name: string;
  assignedTo: User | null;
  project: Project;
  labels: Label[];
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatusType = "TODO" | "In Progress" | "Completed";
export type TaskPriorityType = "Low" | "Medium" | "High";

export interface TaskFormType {
  name: string;
  assignedTo?: string | null;
  labels: {
    name: string;
    color: string;
  }[];
  status: TaskStatusType;
  priority: TaskPriorityType;
  description: string;
  dueDate: string;
  project?: string;
}

export interface UpdateTaskFormType {
  _id?: string;
  name?: string;
  assignedTo?: string;
  labels?: {
    name: string;
    color: string;
  }[];
  status?: TaskStatusType;
  priority?: TaskPriorityType;
  description?: string;
  dueDate?: Date | string;
  project?: string;
}
