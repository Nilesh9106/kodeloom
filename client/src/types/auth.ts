export type LoginFormType = {
  username: string;
  password: string;
};
export type RegisterFormType = {
  username: string;
  name: string;
  email: string;
  password: string;
};

export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserFormType = {
  name?: string;
  email?: string;
  avatar?: string;
};
