import { User } from "./auth";

export type CreateProjectFormType = {
  name: string;
  description: string;
  repo: string;
  labels: Label[];
  members: string[];
  managers: string[];
  createdBy: string;
};
export type UpdateProjectFormType = {
  name?: string;
  description?: string;
  repo?: string;
  labels?: Label[];
};

export type Label = {
  name: string;
  color: string;
};

export interface Project {
  _id?: string;
  name: string;
  description: string;
  repo: string;
  labels: Label[];
  members: User[];
  createdBy: User;
  managers: User[];
  createdAt: Date;
  updatedAt: Date;
}

export type MemberFormType = {
  userId: string;
  role: "member" | "manager";
};
