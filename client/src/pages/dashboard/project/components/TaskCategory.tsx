import { Card, CardBody, CardHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";

import AddTask from "./addTask";
import { Task, TaskStatusType } from "../../../../types/task";
import { Project } from "../../../../types/project";

import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useDrop } from "react-dnd";

export const TaskCategoryCard = ({
  type,
  tasks,
  isAdmin,
  project,
  fetchTasks,
  onStatusChange,
  onTasksChange,
  filter,
}: {
  type: TaskStatusType;
  tasks: Task[];
  filter: "all" | "pending" | "overdue";
  isAdmin: boolean;
  project: Project;
  fetchTasks: () => void;
  onTasksChange: (tasks: Task[]) => void;
  onStatusChange: (val: TaskStatusType, id: string) => Promise<void>;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(0);
  const [filteredTasks, setFilteredTasks] = useState([] as Task[]);
  const [{ isOver }, dropRef] = useDrop({
    accept: "TASK",
    drop: (item: { task: Task }) => {
      onStatusChange(type, item.task._id!);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  useEffect(() => {
    if (filter == "overdue") {
      setFilteredTasks(
        tasks
          .filter((task) => task.dueDate && new Date(task.dueDate) < new Date())
          .sort((a, b) => {
            return (
              new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
            );
          })
      );
    } else if (filter == "pending") {
      setFilteredTasks(
        tasks
          .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
          .sort((a, b) => {
            return (
              new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
            );
          })
      );
    } else {
      setFilteredTasks(
        tasks.sort((a, b) => {
          return (
            new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
          );
        })
      );
    }
  }, [filter, tasks]);

  return (
    <>
      <Card
        ref={dropRef}
        className={`sm:flex-1 max-sm:w-full ${
          isOver
            ? "border-2 border-blue-600"
            : "border-2 dark:border-neutral-900 border-neutral-200"
        }`}
      >
        <CardHeader className="flex justify-between items-center">
          <div>{type} Tasks</div>
          {isAdmin && (
            <AddTask project={project} onAdd={fetchTasks} type={type} />
          )}
        </CardHeader>
        <CardBody>
          <div className="flex flex-col gap-2">
            {filteredTasks
              .filter((task) => task.status === type)
              .map((task) => (
                <TaskCard
                  key={task._id}
                  tasks={filteredTasks}
                  task={task}
                  onOpen={onOpen}
                  setSelectedTask={setSelectedTask}
                />
              ))}
            {filteredTasks.filter((task) => task.status === type).length ===
              0 && <div>No tasks</div>}
          </div>
        </CardBody>
      </Card>
      <TaskModal
        isOpen={isOpen}
        onTaskChange={async (task) => {
          const newTasks = [...tasks];
          newTasks[selectedTask] = task;
          onTasksChange(newTasks);
        }}
        project={project}
        onOpenChange={onOpenChange}
        task={filteredTasks[selectedTask] ?? undefined}
        onStatusChange={async (val: string) => {
          await onStatusChange(
            val as TaskStatusType,
            filteredTasks[selectedTask]._id!
          );
        }}
      />
    </>
  );
};
