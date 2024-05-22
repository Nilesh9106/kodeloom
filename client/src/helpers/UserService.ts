import { User } from "../types/auth";
import api from "../utils/api";
import { apiRoutes } from "../utils/apiRoutes";
import { errorHandler } from "../utils/handler";

export class UserService {
  static searchUser = errorHandler(async (username?: string) => {
    const { data } = await api.get(apiRoutes.user.search(username));
    return data as {
      users: User[];
    };
  });
  static getUserByUsername = errorHandler(async (username: string) => {
    const { data } = await api.get(apiRoutes.user.getByUsername(username));
    return data as {
      user: User;
    };
  });
  static updateUser = errorHandler(async (id: string, body: User) => {
    const { data } = await api.put(apiRoutes.user.update(id), body);
    return data as {
      user: User;
    };
  });
  static deleteUser = errorHandler(async (id: string) => {
    const { data } = await api.delete(apiRoutes.user.delete(id));
    return data as {
      user: User;
    };
  });
}
