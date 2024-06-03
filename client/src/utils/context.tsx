import { create } from "zustand";
import { Project } from "../types/project";
import { User } from "../types/auth";
import { ProjectService } from "../helpers/ProjectService";

interface MyState {
  projects: Project[];
  user: User | null;
  setProjects: (project: Project[]) => void;
  setUser: (user: User | null) => void;
  fetchProjects: () => Promise<void>;
}

const useLoom = create<MyState>((set) => ({
  projects: [],
  user: null,
  setProjects: (projects) => set({ projects }),
  setUser: (user) => set({ user }),
  fetchProjects: async () => {
    const userId = useLoom.getState().user?._id;
    if (!userId) {
      return;
    }
    const res = await ProjectService.getProjectsByUserId(userId);
    if (res) {
      set({ projects: res.projects });
    }
  },
}));

export default useLoom;
