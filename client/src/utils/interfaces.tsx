
export interface User {
    _id: string
    username: string
    name: string
    email: string
}
export interface Project {
    _id?: string
    name: string
    description: string
    repo: string
    labels: string[]
    members: User[]
    managers: User[]
}
export interface Task {
    _id?: string
    name: string
    assignedTo: User
    project: Project
    labels: string[]
    description: string
    status: string
    priority: string
    dueDate: Date
}


