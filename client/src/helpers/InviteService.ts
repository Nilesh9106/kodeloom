import { Invite } from "../types/invite";
import { Project } from "../types/project";
import api from "../utils/api";
import { apiRoutes } from "../utils/apiRoutes";
import { errorHandler } from "../utils/handler";

export class InviteService {
  static getInvitesByUserId = errorHandler(async (userId: string) => {
    const { data } = await api.get(apiRoutes.invite.getByUserId(userId));
    return data as {
      invites: Invite[];
    };
  });
  static getInvitesByProjectId = errorHandler(async (projectId: string) => {
    const { data } = await api.get(apiRoutes.invite.getByProjectId(projectId));
    return data as {
      invites: Invite[];
    };
  });
  static acceptInvite = errorHandler(async (inviteId: string) => {
    const { data } = await api.post(apiRoutes.invite.accept(inviteId));
    return data as {
      project: Project;
      invites: Invite[];
    };
  });
  static rejectInvite = errorHandler(async (inviteId: string) => {
    const { data } = await api.post(apiRoutes.invite.reject(inviteId));
    return data as {
      invites: Invite[];
    };
  });
}
