import {
  CreateProjectFormType,
  MemberFormType,
  Project,
  UpdateProjectFormType,
} from "../types/project";
import api from "../utils/api";
import { apiRoutes } from "../utils/apiRoutes";
import { errorHandler } from "../utils/handler";

export class ProjectService {
  static createProject = errorHandler(async (body: CreateProjectFormType) => {
    const { data } = await api.post(apiRoutes.project.create, body);
    return data as {
      project: Project;
    };
  });
  static updateProject = errorHandler(
    async (id: string, body: UpdateProjectFormType) => {
      const { data } = await api.put(apiRoutes.project.update(id), body);
      return data as {
        project: Project;
      };
    }
  );
  static deleteProject = errorHandler(async (id: string) => {
    const { data } = await api.delete(apiRoutes.project.delete(id));
    return data as {
      message: string;
    };
  });
  static getProjectById = errorHandler(async (id: string) => {
    const { data } = await api.get(apiRoutes.project.getById(id));
    return data as {
      project: Project;
    };
  });
  static getProjectsByUserId = errorHandler(async (userId: string) => {
    const { data } = await api.get(apiRoutes.project.getByUserId(userId));
    return data as {
      projects: Project[];
    };
  });
  static addMemberToProject = errorHandler(
    async (projectId: string, body: MemberFormType) => {
      const { data } = await api.post(
        apiRoutes.project.addMember(projectId),
        body
      );
      return data as {
        project: Project;
      };
    }
  );
  static removeMemberFromProject = errorHandler(
    async (projectId: string, body: MemberFormType) => {
      const { data } = await api.post(
        apiRoutes.project.removeMember(projectId),
        body
      );
      return data as {
        project: Project;
      };
    }
  );
  static makeManager = errorHandler(
    async (projectId: string, userId: string) => {
      const { data } = await api.post(
        apiRoutes.project.makeManager(projectId),
        { userId }
      );
      return data as {
        project: Project;
      };
    }
  );
  static removeManager = errorHandler(
    async (projectId: string, userId: string) => {
      const { data } = await api.post(
        apiRoutes.project.removeManager(projectId),
        { userId }
      );
      return data as {
        project: Project;
      };
    }
  );
}
