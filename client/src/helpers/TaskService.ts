import { Task, TaskFormType, UpdateTaskFormType } from "../types/task";
import api from "../utils/api";
import { apiRoutes } from "../utils/apiRoutes";
import { errorHandler } from "../utils/handler";

export class TaskService {
  static createTask = errorHandler(async (body: TaskFormType) => {
    const { data } = await api.post(apiRoutes.task.create, body);
    return data as {
      task: Task;
    };
  });
  static updateTask = errorHandler(
    async (id: string, body: UpdateTaskFormType) => {
      const { data } = await api.put(apiRoutes.task.update(id), body);
      return data as {
        task: Task;
      };
    }
  );
  static deleteTask = errorHandler(async (id: string) => {
    const { data } = await api.delete(apiRoutes.task.delete(id));
    return data as {
      message: string;
    };
  });
  static getTaskById = errorHandler(async (id: string) => {
    const { data } = await api.get(apiRoutes.task.getById(id));
    return data as {
      task: Task;
    };
  });
  static getTasksByProjectId = errorHandler(async (projectId: string) => {
    const { data } = await api.get(apiRoutes.task.getByProjectId(projectId));
    return data as {
      tasks: Task[];
    };
  });
  static getTasksByUserId = errorHandler(async (userId: string) => {
    const { data } = await api.get(apiRoutes.task.getByUserId(userId));
    return data as {
      tasks: Task[];
    };
  });
  static getTasksByUserIdAndProjectId = errorHandler(
    async (userId: string, projectId: string) => {
      const { data } = await api.get(
        apiRoutes.task.getByUserIdAndProjectId(userId, projectId)
      );
      return data as {
        tasks: Task[];
      };
    }
  );
}
