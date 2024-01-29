import { BreadcrumbItem, Breadcrumbs, Button, Select, SelectItem } from "@nextui-org/react";
import useLoom from "../../../utils/context";
import { useEffect, useState } from "react";
import { Project, Task } from "../../../utils/interfaces";
import { Link, useParams } from "react-router-dom";
import { getCall, putCall } from "../../../utils/api";
import { MdGroup } from "react-icons/md";
import Loading from "../../../components/Loading";
import { TaskCategoryCard } from "./components/TaskCategory";


export default function ProjectPage() {
    const projects = useLoom((state) => state.projects)
    const [project, setProject] = useState<Project>()
    const [loading, setLoading] = useState(false)
    const [tasks, setTasks] = useState([] as Task[])
    const { id } = useParams<{ id: string }>()


    const fetchTasks = async () => {
        setLoading(true)
        const data = await getCall(`tasks/project/${id}`)
        if (data) {
            setTasks(data.tasks)
        }
        setLoading(false)
    }
    const onStatusChange = async (val: string, id: string) => {

        const data = await putCall(`tasks/${id}`, { status: val })
        if (data) {
            setTasks(tasks.map((task) => {
                if (task._id === id) {
                    task.status = val
                }
                return task
            }))
        }
    }

    useEffect(() => {
        (async () => {
            if (projects.length > 0) {
                const p = projects.find((project) => project._id === id)
                // console.log(p);
                setProject(p)
                await fetchTasks()
            }
        })()
    }, [projects, id])

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
                        <Button variant="light" isIconOnly as={Link} to={`/dashboard/p/${id}/info`}>
                            <MdGroup className="text-xl" />
                        </Button>
                    </div>
                </div>
                {loading && <Loading />}
                {!loading && <div className="flex max-sm:flex-col gap-3 my-2">
                    <TaskCategoryCard type="TODO" tasks={tasks} isAdmin={project?.managers.find((user) => user._id == user?._id) ? true : false} project={project!} fetchTasks={fetchTasks} onStatusChange={onStatusChange} />
                    <TaskCategoryCard type="In Progress" tasks={tasks} isAdmin={project?.managers.find((user) => user._id == user?._id) ? true : false} project={project!} fetchTasks={fetchTasks} onStatusChange={onStatusChange} />
                    <TaskCategoryCard type="Completed" tasks={tasks} isAdmin={project?.managers.find((user) => user._id == user?._id) ? true : false} project={project!} fetchTasks={fetchTasks} onStatusChange={onStatusChange} />
                </div>}
            </div>
        </>
    )
}
