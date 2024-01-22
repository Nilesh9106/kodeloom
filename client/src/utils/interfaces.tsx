
export interface User {
    _id: number
    username: string
    name: string
    email: string
}
export interface Project {
    _id: number
    name: string
    description: string
    repo: string
    labels: string[]
    members: User[]
    managers: User[]
}
export interface Task {
    _id: number
    name: string
    assignedTo: User
    project: Project
    labels: string[]
    description: string
    status: string
    priority: string
    dueDate: Date
}


