import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Select, SelectItem } from "@nextui-org/react";
import useLoom from "../../../utils/context";
import { useEffect, useState } from "react";
import { Project, Task } from "../../../utils/interfaces";
import { useParams } from "react-router-dom";
import { getCall } from "../../../utils/api";
import { MdPersonAddAlt1 } from "react-icons/md";
import AddTask from "./components/addTask";

const TaskCard = (task: Task) => {
    return (
        <Card key={task._id} radius="sm" isPressable onPress={() => console.log(task)}>
            <CardHeader>{task.name}</CardHeader>
        </Card>
    )
}

const TaskCategoryCard = (key: string, tasks: Task[]) => {
    return (
        <Card className="sm:flex-1 max-sm:w-full">
            <CardHeader className="flex justify-between items-center">

                <div>
                    {key} Tasks
                </div>
                <AddTask />

            </CardHeader>
            <CardBody>
                <div className="flex flex-col gap-2">
                    {tasks.filter((task) => task.status === key).map((task) => (
                        TaskCard(task)
                    ))}
                    {tasks.filter((task) => task.status === key).length === 0 && <div>No tasks</div>}
                </div>
            </CardBody>
        </Card>
    )
}

export default function ProjectPage() {
    const projects = useLoom((state) => state.projects)
    // const user = useLoom((state) => state.user)
    const [project, setProject] = useState<Project>()
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([] as Task[])
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        (async () => {
            if (projects.length > 0) {
                const p = projects.find((project) => project._id === id)
                setProject(p)
                setLoading(true)
                const data = await getCall(`tasks/project/${id}`)
                if (data) {
                    setTasks(data.tasks)
                }
                setLoading(false)
            }
        })()
    }, [])

    return (
        <>
            <div className="flex flex-col gap-2">
                <Breadcrumbs>
                    <BreadcrumbItem>Projects</BreadcrumbItem>
                    <BreadcrumbItem>{project?.name}</BreadcrumbItem>
                </Breadcrumbs>
                <div className="flex justify-between items-center ">
                    <div className="text-2xl font-semibold">{project?.name}</div>
                    <div className="flex gap-1">
                        <Select className="w-40 flex items-center" placeholder="Group By" label="Group" labelPlacement="outside-left">
                            <SelectItem key={"none"} value={"None"}>
                                None
                            </SelectItem>
                            <SelectItem key={"assignee"} value={"Assignee"}>
                                Assignee
                            </SelectItem>
                        </Select>
                        <Button variant="light" isIconOnly>
                            <MdPersonAddAlt1 className="text-xl" />
                        </Button>
                    </div>
                </div>
                {loading && <div>Loading...</div>}
                <div className="flex max-sm:flex-col gap-3 my-2">
                    {TaskCategoryCard("TODO", tasks)}
                    {TaskCategoryCard("In Progress", tasks)}
                    {TaskCategoryCard("Completed", tasks)}
                </div>
            </div>
        </>
    )
}
