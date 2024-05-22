import { create } from "zustand";
import { Project } from "../types/project";
import { User } from "../types/auth";

interface MyState {
  projects: Project[];
  user: User | null;
  setProjects: (project: Project[]) => void;
  setUser: (user: User) => void;
}

const useLoom = create<MyState>((set) => ({
  projects: [],
  user: null,
  setProjects: (projects) => set({ projects }),
  setUser: (user) => set({ user }),
}));

export default useLoom;
