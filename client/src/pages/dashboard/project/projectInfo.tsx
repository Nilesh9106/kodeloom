import { useEffect, useState } from "react";
import useLoom from "../../../utils/context";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { SiGithub } from "react-icons/si";
import ReactTimeAgo from "react-time-ago";
import AddMember from "./components/addMember";
import { Project } from "../../../types/project";
import { toast } from "sonner";
import { ProjectService } from "../../../helpers/ProjectService";
import { MdOutlineRefresh } from "react-icons/md";

export default function ProjectInfo() {
  const projects = useLoom((state) => state.projects);
  const setProjects = useLoom((state) => state.setProjects);
  const user = useLoom((state) => state.user);
  const fetchProjects = useLoom((state) => state.fetchProjects);
  const [project, setProject] = useState<Project>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const handleDelete = async (userId: string, role: "member" | "manager") => {
    if (!id) {
      return;
    }
    if (!confirm("Are you sure you want to delete this member?")) {
      return;
    }
    const token = toast.loading("Deleting Member...");
    const res = await ProjectService.removeMemberFromProject(id, {
      userId,
      role,
    });
    if (res) {
      if (user?._id == userId) {
        setProjects(projects.filter((p) => p._id !== id));
        navigate("/dashboard");
        toast.dismiss(token);
        toast.success("Member Deleted Successfully");
        return;
      }
      setProject(res.project);
      setProjects(
        projects.map((p) => {
          if (p._id === res.project._id) {
            return res.project;
          }
          return p;
        })
      );
      toast.success("Member Deleted Successfully");
    }
    toast.dismiss(token);
  };
  const makeManager = async (userId: string) => {
    if (!id) {
      return;
    }
    const token = toast.loading("Making Manager...");
    const res = await ProjectService.makeManager(id, userId);
    if (res) {
      setProject(res.project);
      setProjects(
        projects.map((p) => {
          if (p._id === res.project._id) {
            return res.project;
          }
          return p;
        })
      );
      toast.success("Manager Added Successfully");
    }
    toast.dismiss(token);
  };
  const removeManager = async (userId: string) => {
    if (!id) {
      return;
    }
    const token = toast.loading("Removing Manager...");
    const res = await ProjectService.removeManager(id, userId);
    if (res) {
      setProject(res.project);
      setProjects(
        projects.map((p) => {
          if (p._id === res.project._id) {
            return res.project;
          }
          return p;
        })
      );
      toast.success("Manager Removed Successfully");
    }
    toast.dismiss(token);
  };

  useEffect(() => {
    if (projects.length > 0) {
      const p = projects.find((project) => project._id === id);
      if (!p) {
        navigate("/dashboard");
        return;
      }
      setProject(p);
    } else {
      navigate("/dashboard");
    }
  }, [projects, id, navigate]);

  return (
    <>
      {project && (
        <div className="flex flex-col gap-2">
          <Breadcrumbs>
            <BreadcrumbItem>Projects</BreadcrumbItem>
            <BreadcrumbItem onClick={() => navigate(`/dashboard/p/${id}/`)}>
              {project?.name}
            </BreadcrumbItem>
            <BreadcrumbItem>Info</BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex justify-between items-center my-3">
            <div className="flex flex-col">
              <div className="text-2xl font-semibold">{project?.name}</div>
              <div className="text-sm leading-tight text-default-600 line-clamp-2">
                {project?.description}
              </div>
              <div className="text-sm leading-tight text-default-400 my-2">
                <span>
                  Created <ReactTimeAgo date={project.createdAt} /> • Updated{" "}
                  <ReactTimeAgo date={project.updatedAt} />{" "}
                </span>
              </div>
            </div>
            <div>
              <Tooltip content="Github Repository">
                <Button
                  isIconOnly
                  variant="light"
                  as={Link}
                  to={project.repo}
                  target="_blank"
                >
                  <SiGithub className="text-xl text-default-600" />
                </Button>
              </Tooltip>
            </div>
          </div>
          <Table
            topContent={
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">Members</div>
                <div className="flex gap-3">
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      await fetchProjects();
                      setLoading(false);
                    }}
                    isIconOnly
                    variant="light"
                  >
                    <MdOutlineRefresh className="text-xl" />
                  </Button>
                  {project.managers.find((u) => u._id == user?._id) && (
                    <AddMember project={project} />
                  )}
                </div>
              </div>
            }
          >
            <TableHeader>
              <TableColumn>Name</TableColumn>
              <TableColumn>Role</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="No Users to show"
              items={[...project.managers, ...project.members]}
              loadingContent={<Spinner />}
              loadingState={loading ? "loading" : "idle"}
            >
              {(item) => {
                const isAdmin = project.managers.find(
                  (user) => user._id == item._id
                )
                  ? true
                  : false;
                const dropdownItems = [
                  {
                    key: "manager",
                    label: isAdmin ? "Remove as Manager" : "Make Manager",
                    onClick: () => {
                      if (isAdmin) {
                        removeManager(item._id);
                      } else {
                        makeManager(item._id);
                      }
                    },
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    onClick: () => {
                      handleDelete(item._id, isAdmin ? "manager" : "member");
                    },
                  },
                ];
                if (project.createdBy._id == item._id) {
                  dropdownItems.shift();
                  dropdownItems.shift();
                }
                if (project.createdBy._id != user?._id) {
                  dropdownItems.shift();
                }
                if (
                  item._id != user?._id &&
                  project.managers.find((u) => u._id == user?._id) == undefined
                ) {
                  dropdownItems.pop();
                }
                return (
                  <TableRow key={item._id}>
                    <TableCell>
                      <User
                        avatarProps={{
                          radius: "lg",
                          src: item.avatar,
                        }}
                        description={item.email}
                        name={item.name}
                      >
                        {item.email}
                      </User>
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={
                          project.createdBy._id == item._id
                            ? "warning"
                            : isAdmin
                            ? "success"
                            : "primary"
                        }
                        size="sm"
                        variant="flat"
                      >
                        {project.createdBy._id == item._id
                          ? "Creator"
                          : isAdmin
                          ? "Manager"
                          : "Member"}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button isIconOnly variant="light">
                            <BiDotsVertical className="text-xl text-default-500" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu variant="flat" items={dropdownItems}>
                          {(item) => (
                            <DropdownItem
                              key={item.key}
                              color={
                                item.key === "delete" ? "danger" : "default"
                              }
                              className={
                                item.key === "delete" ? "text-danger" : ""
                              }
                              onClick={item.onClick}
                            >
                              {item.label}
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              }}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
