
type Label = {
    name: string
    color: string
}

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
    labels: Label[]
    members: User[]
    managers: User[]
    createdAt: Date
    updatedAt: Date
}
export interface Task {
    _id?: string
    name: string
    assignedTo: User
    project: Project
    labels: Label[]
    description: string
    status: string
    priority: string
    dueDate: Date
    createdAt: Date
    updatedAt: Date
}


