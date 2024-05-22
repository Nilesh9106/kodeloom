import { User } from "./auth";
import { Project } from "./project";

export type Invite = {
  _id: string;
  user: User;
  project: Project;
  role: string;
};
