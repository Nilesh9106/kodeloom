import { Button, Chip, Input, Textarea } from "@nextui-org/react"
import { useState } from "react"
import { Project } from "../../../utils/interfaces"
import useLoom from "../../../utils/context"
import { postCall } from "../../../utils/api";
import { useNavigate } from "react-router-dom";

type Label = {
    name: string
    color: string
}

export default function CreateProject() {
    const user = useLoom((state) => state.user);
    const setProjects = useLoom((state) => state.setProjects);
    const projects = useLoom((state) => state.projects);
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [label, setLabel] = useState("")
    const [project, setProject] = useState({
        name: "",
        description: "",
        repo: "",
        labels: [] as Label[],
        managers: [user?._id] as string[],
        members: [],
    })

    const handleSubmit = async () => {
        console.log(project);
        setLoading(true)
        const data = await postCall("projects/", project)
        if (data) {
            setProjects([...projects, data.project as Project])
            console.log(data.project);
            navigate(`/dashboard/p/${data.project._id}`)
        }
        setLoading(false)
    }
    return (
        <>
            <div className="flex flex-col gap-1 lg:px-10">
                <h1 className="text-2xl font-bold ">Create Project</h1>
                <div className="my-1 flex max-md:flex-col gap-2">
                    <Input label="Name" isRequired value={project.name} onChange={(e) => {
                        setProject({ ...project, name: e.currentTarget.value })
                    }} variant="faded" type="text" radius="sm" placeholder="Project Name" labelPlacement="outside" className="md:flex-1" />
                    <Input label="Repository Link" isRequired value={project.repo} onChange={(e) => setProject({ ...project, repo: e.currentTarget.value })} variant="faded" type="url" radius="sm" placeholder="Repository URL" labelPlacement="outside" className="md:flex-1" />
                </div>
                <div className="my-1">
                    <Textarea
                        variant={"faded"}
                        label="Description"
                        isRequired
                        labelPlacement="outside"
                        placeholder="Enter your Project description"
                        minRows={3}
                        value={project.description}
                        onChange={(e) => setProject({ ...project, description: e.currentTarget.value })}
                    />
                </div>
                <div className="my-1 flex flex-col gap-2">
                    {project.labels.length > 0 && <div className="flex flex-wrap gap-1 ">
                        {project.labels.map((label, index) => (
                            <Chip key={index} style={{
                                color: label.color
                            }} onClose={() => {
                                setProject({ ...project, labels: project.labels.filter((_, i) => i !== index) })
                            }} variant="flat">
                                {label.name}
                            </Chip>
                        ))}
                    </div>}
                    <Input onKeyDown={(e) => {
                        if (e.key == 'Enter' || e.keyCode == 188) {
                            e.preventDefault();
                            if (label.trim() == "") return;
                            setProject({ ...project, labels: [...project.labels, { name: label.trim(), color: "#" + Math.floor(Math.random() * 16777215).toString(16) }] })
                            setLabel("")
                        }
                    }} onChange={(e) => {
                        if (e.currentTarget.value.charAt(e.currentTarget.value.length - 1) == ',') {
                            e.preventDefault();
                            if (label.trim() == "") return;
                            setProject({ ...project, labels: [...project.labels, { name: label.trim(), color: "#" + Math.floor(Math.random() * 16777215).toString(16) }] })
                            setLabel("")
                        }
                        setLabel(e.currentTarget.value);
                    }} value={label} label="Labels" variant="faded" type="text" radius="sm" placeholder="Labels for tasks" labelPlacement="outside" className="md:flex-1" />
                </div>
                <Button color="secondary" className="my-2" variant="shadow" onClick={handleSubmit} isLoading={loading}>
                    {loading ? "Creating Project" : "Create Project"}
                </Button>
            </div>
        </>
    )
}