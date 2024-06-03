import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
} from "@nextui-org/react";
import { Task } from "../../../../types/task";
import { useDrag } from "react-dnd";

const TaskCard = ({
  task,
  setSelectedTask,
  onOpen,
  tasks,
}: {
  task: Task;
  tasks: Task[];
  setSelectedTask: (val: number) => void;
  onOpen: () => void;
}) => {
  const [, drag] = useDrag(
    () => ({
      type: "TASK",
      item: { task },
    }),
    [task]
  );

  return (
    <Card
      key={task._id}
      ref={drag}
      radius="sm"
      isPressable
      onPress={() => {
        setSelectedTask(tasks.findIndex((t) => t._id === task._id));
        onOpen();
      }}
    >
      <CardHeader className="flex justify-between font-semibold capitalize pb-0 items-center">
        <span>{task.name}</span>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <p className="dark:text-neutral-400 text-neutral-700 line-clamp-2">
          {task.description}
        </p>
        <Divider className="my-1" />
        <div className="flex items-center">
          <Tooltip content={task.assignedTo?.username ?? "Unassigned"}>
            <Avatar src={task.assignedTo?.avatar} size="sm" />
          </Tooltip>
          <div className="flex flex-wrap flex-1 justify-end gap-2">
            <Tooltip content="Priority">
              <Chip
                key={task.priority}
                size="sm"
                variant="flat"
                color={
                  task.priority == "Low"
                    ? "success"
                    : task.priority == "Medium"
                    ? "warning"
                    : "danger"
                }
              >
                {task.priority}
              </Chip>
            </Tooltip>
            {task.labels.map((label) => (
              <Chip
                key={label.name}
                size="sm"
                variant="flat"
                style={{
                  backgroundColor: label.color + "30",
                  color: label.color,
                }}
                className="backdrop-blur"
              >
                {label.name}
              </Chip>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskCard;
