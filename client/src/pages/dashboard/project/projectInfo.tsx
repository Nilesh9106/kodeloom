import { useEffect, useState } from "react"
import useLoom from "../../../utils/context"
import { Project } from "../../../utils/interfaces"
import { Link, useNavigate, useParams } from "react-router-dom"
import { BreadcrumbItem, Breadcrumbs, Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, User } from "@nextui-org/react"
import { BiDotsVertical } from "react-icons/bi"
import { SiGithub } from "react-icons/si"
import ReactTimeAgo from "react-time-ago"
import AddMember from "./components/addMember"

export default function ProjectInfo() {
    const projects = useLoom((state) => state.projects)
    const user = useLoom((state) => state.user)
    const [project, setProject] = useState<Project>()
    // const [loading, setLoading] = useState(false) 
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()

    const handleDelete = (userId: string, role: string) => {
        console.log(userId, id, role);
    }

    useEffect(() => {
        if (projects.length > 0) {
            const p = projects.find((project) => project._id === id)
            setProject(p)
        }
    }, [projects, id])

    return (
        <>
            {project && (
                <div className="flex flex-col gap-2">
                    <Breadcrumbs>
                        <BreadcrumbItem>Projects</BreadcrumbItem>
                        <BreadcrumbItem onClick={() => navigate(`/dashboard/p/${id}/`)}>{project?.name}</BreadcrumbItem>
                        <BreadcrumbItem>Info</BreadcrumbItem>
                    </Breadcrumbs>
                    <div className="flex justify-between items-center my-3">
                        <div className="flex flex-col">
                            <div className="text-2xl font-semibold">{project?.name}</div>
                            <div className="text-sm leading-tight text-default-600 line-clamp-2">{project?.description}</div>
                            <div className="text-sm leading-tight text-default-400 my-2">
                                Create <ReactTimeAgo date={project.createdAt} />
                            </div>
                        </div>
                        <div>
                            <Tooltip content="Github Repository">
                                <Button isIconOnly variant="light" as={Link} to={project.repo} target="_blank" >
                                    <SiGithub className="text-xl text-default-600" />
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                    <Table topContent={
                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">Members</div>
                            <AddMember project={project} />
                        </div>
                    }>
                        <TableHeader >
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Role</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="No Users to show" items={[...project.managers, ...project.members].filter((item) => {
                            return item._id !== project.createdBy._id && item._id !== user?._id
                        })}>
                            {(item) => {
                                const isAdmin = project.managers.find((user) => user._id == item._id) ? true : false;
                                return (
                                    <TableRow key={item._id}>
                                        <TableCell>
                                            <User
                                                avatarProps={{ radius: "lg", src: "https://i.pravatar.cc/150?u=a042581f4e29026704d" }}
                                                description={item.email}
                                                name={item.name}
                                            >
                                                {item.email}
                                            </User>
                                        </TableCell>
                                        <TableCell>
                                            <Chip className="capitalize" color={isAdmin ? "success" : "primary"} size="sm" variant="flat">
                                                {isAdmin ? "Manager" : "Member"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Dropdown>
                                                <DropdownTrigger>
                                                    <Button isIconOnly variant="light">
                                                        <BiDotsVertical className="text-xl text-default-500" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu>
                                                    <DropdownItem>
                                                        {(isAdmin ? "Remove as Manager" : "Make Manager")}
                                                    </DropdownItem>
                                                    <DropdownItem onClick={() => {
                                                        handleDelete(item._id, isAdmin ? "manager" : "member");
                                                    }}>
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                )
                            }}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    )
}
