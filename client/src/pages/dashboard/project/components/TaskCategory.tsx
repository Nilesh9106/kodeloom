import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, User, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import useLoom from "../../../../utils/context";
import { Project, Task } from "../../../../utils/interfaces";
import ReactTimeAgo from "react-time-ago";
import AddTask from "./addTask";

const TaskModal = ({ isOpen, onOpenChange, task, onStatusChange, project }: { isOpen: boolean, project: Project, onOpenChange: () => void, task: Task, onStatusChange: (val: string) => Promise<void> }) => {
    const [loading, setLoading] = useState(false)
    const user = useLoom((state) => state.user)

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex items-center gap-5 capitalize font-bold text-2xl ">
                            <span className="leading-tight">{task.name}</span>
                            <Chip key={task.priority} className="mt-1.5" size="sm" variant="flat" color={task.priority == "Low" ? "success" : (task.priority == "Medium" ? "warning" : "danger")}>
                                {task.priority}
                            </Chip>
                        </ModalHeader>
                        <ModalBody className="flex flex-col ">
                            <p>
                                {task.description}
                            </p>
                            <Card>
                                <CardHeader>
                                    {(task.assignedTo._id == user?._id || project.managers.find((user) => user._id == task.assignedTo._id)) && <RadioGroup label="status" isDisabled={loading} value={task.status} onValueChange={async (val) => {
                                        setLoading(true)
                                        await onStatusChange(val)
                                        setLoading(false)
                                    }}>
                                        <div className="flex gap-3">

                                            <Radio value="TODO" color="warning">TODO</Radio>
                                            <Radio value="In Progress" color="secondary">In Progress</Radio>
                                            <Radio value="Completed" color="success">Completed</Radio>
                                        </div>
                                    </RadioGroup>}
                                </CardHeader>
                                <CardBody className="flex flex-col gap-2">
                                    <span className="font-semibold text-neutral-500">Assignee: </span>
                                    <User className="justify-start my-2" name={task.assignedTo.name} description={task.assignedTo.email} avatarProps={{
                                        src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                                        size: "sm"
                                    }} />
                                    <span className="font-semibold ">Due Date: <ReactTimeAgo date={task.dueDate} /></span>

                                    <Divider className="my-1" />
                                    <div className="flex gap-1">
                                        {task.labels.map((label) => (
                                            <Chip key={label.name} size="sm" variant="flat" style={{ backgroundColor: label.color + "30", color: label.color }} className="backdrop-blur" >
                                                {label.name}
                                            </Chip>
                                        ))}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-sm">Created <ReactTimeAgo date={task.createdAt} /> </p>
                                        <p className="text-sm">Updated  <ReactTimeAgo date={task.updatedAt} /></p>
                                    </div>
                                </CardBody>
                            </Card>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" isLoading={loading} variant="flat" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

const TaskCard = (task: Task) => {
    return (
        <>

            <CardHeader className="flex justify-between font-semibold capitalize pb-0 items-center">
                <span>{task.name}</span>

            </CardHeader>
            <CardBody className="flex flex-col gap-2">
                <p className="dark:text-neutral-400 text-neutral-700">
                    {task.description}
                </p>
                <Divider className="my-1" />
                <div className="flex items-center">
                    <Avatar src={"https://i.pravatar.cc/150?u=a042581f4e29026024d"} size="sm" />
                    <div className="flex flex-wrap flex-1 justify-end gap-2">
                        <Chip key={task.priority} size="sm" variant="flat" color={task.priority == "Low" ? "success" : (task.priority == "Medium" ? "warning" : "danger")}>
                            {task.priority}
                        </Chip>
                        {task.labels.map((label) => (
                            <Chip key={label.name} size="sm" variant="flat" style={{ backgroundColor: label.color + "30", color: label.color }} className="backdrop-blur" >
                                {label.name}
                            </Chip>
                        ))}
                    </div>
                </div>
            </CardBody>
        </>
    )
}


export const TaskCategoryCard = ({ type, tasks, isAdmin, project, fetchTasks, onStatusChange }: { type: string, tasks: Task[], isAdmin: boolean, project: Project, fetchTasks: () => void, onStatusChange: (val: string, id: string) => Promise<void> }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState(0);

    return (
        <>
            <Card className="sm:flex-1 max-sm:w-full">
                <CardHeader className="flex justify-between items-center">
                    <div>
                        {type} Tasks
                    </div>
                    {isAdmin && <AddTask project={project} onAdd={fetchTasks} type={type} />}
                </CardHeader>
                <CardBody>
                    <div className="flex flex-col gap-2">
                        {tasks.filter((task) => task.status === type).map((task) => (
                            <Card key={task._id} radius="sm" isPressable onPress={() => {
                                setSelectedTask(tasks.findIndex((t) => t._id === task._id))
                                onOpen()
                            }}>
                                {TaskCard(task)}
                            </Card>
                        ))}
                        {tasks.filter((task) => task.status === type).length === 0 && <div>No tasks</div>}
                    </div>
                </CardBody>
            </Card>
            <TaskModal isOpen={isOpen} project={project} onOpenChange={onOpenChange} task={tasks[selectedTask]} onStatusChange={async (val: string) => {
                await onStatusChange(val, tasks[selectedTask]._id!)
            }} />
        </>
    )
}