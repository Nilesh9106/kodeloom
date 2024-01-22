import { create } from 'zustand'
import { Project, User } from './interfaces'

interface MyState {
    projects: Project[]
    user: User | null
    setProjects: (project: Project[]) => void,
    setUser: (user: User) => void,
}


const useLoom = create<MyState>((set) => ({
    projects: [],
    user: null,
    setProjects: (projects) => set({ projects }),
    setUser: (user) => set({ user }),
}))

export default useLoom