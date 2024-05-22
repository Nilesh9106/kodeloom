import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react";
import useLoom from "../../../utils/context";
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdGroup } from "react-icons/md";
import Loading from "../../../components/Loading";
import { TaskCategoryCard } from "./components/TaskCategory";
import { Project } from "../../../types/project";
import { Task, TaskStatusType } from "../../../types/task";
import { TaskService } from "../../../helpers/TaskService";

export default function ProjectPage() {
  const projects = useLoom((state) => state.projects);
  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([] as Task[]);
  const { id: projectId } = useParams<{ id: string }>();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await TaskService.getTasksByProjectId(projectId!);
    if (res) {
      setTasks(res.tasks);
    }
    setLoading(false);
  }, [projectId]);
  const onStatusChange = async (val: TaskStatusType, id: string) => {
    const res = await TaskService.updateTask(id, { status: val });
    if (res) {
      setTasks(
        tasks.map((task) => {
          if (task._id === id) {
            task.status = val;
          }
          return task;
        })
      );
    }
  };

  useEffect(() => {
    (async () => {
      if (projects.length > 0) {
        const p = projects.find((project) => project._id === projectId);
        setProject(p);
        await fetchTasks();
      }
    })();
  }, [projects, projectId, fetchTasks]);

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
            <Button
              variant="light"
              isIconOnly
              as={Link}
              to={`/dashboard/p/${projectId}/info`}
            >
              <MdGroup className="text-xl" />
            </Button>
          </div>
        </div>
        {loading && <Loading />}
        {!loading && (
          <div className="flex max-sm:flex-col gap-3 my-2">
            <TaskCategoryCard
              type="TODO"
              tasks={tasks}
              isAdmin={
                project?.managers.find((user) => user._id == user?._id)
                  ? true
                  : false
              }
              project={project!}
              fetchTasks={fetchTasks}
              onStatusChange={onStatusChange}
            />
            <TaskCategoryCard
              type="In Progress"
              tasks={tasks}
              isAdmin={
                project?.managers.find((user) => user._id == user?._id)
                  ? true
                  : false
              }
              project={project!}
              fetchTasks={fetchTasks}
              onStatusChange={onStatusChange}
            />
            <TaskCategoryCard
              type="Completed"
              tasks={tasks}
              isAdmin={
                project?.managers.find((user) => user._id == user?._id)
                  ? true
                  : false
              }
              project={project!}
              fetchTasks={fetchTasks}
              onStatusChange={onStatusChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
