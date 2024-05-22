import { BiEdit, BiX } from "react-icons/bi";
import { toast } from "sonner";
import { TaskService } from "../../../../helpers/TaskService";
import useLoom from "../../../../utils/context";
import ReactTimeAgo from "react-time-ago";
import {
  Chip,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  User,
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
import { Project } from "../../../../types/project";
import { Task, TaskStatusType } from "../../../../types/task";
import { useState } from "react";

const TaskModal = ({
  isOpen,
  onOpenChange,
  task,
  onStatusChange,
  project,
  onTaskChange,
}: {
  isOpen: boolean;
  project: Project;
  onOpenChange: () => void;
  task: Task;
  onStatusChange: (val: TaskStatusType) => Promise<void>;
  onTaskChange: (task: Task) => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const user = useLoom((state) => state.user);
  const [editMode, setEditMode] = useState(false);

  const changeAssignedTo = async (userId: string) => {
    if (userId == task.assignedTo._id) return;
    setLoading(true);
    const token = toast.loading("Assigning...");
    const res = await TaskService.assignTask(task._id!, userId);
    if (res) {
      await onTaskChange(res.task);
      toast.success("Assigned Successfully");
      setEditMode(false);
    }
    toast.dismiss(token);
    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-5 capitalize font-bold text-2xl ">
              <span className="leading-tight">{task.name}</span>
              <Chip
                key={task.priority}
                className="mt-1.5"
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
            </ModalHeader>
            <ModalBody className="flex flex-col ">
              <p>{task.description}</p>
              <Card>
                <CardHeader>
                  {(task.assignedTo._id == user?._id ||
                    project.managers.find(
                      (user) => user._id == task.assignedTo._id
                    )) && (
                    <RadioGroup
                      label="status"
                      isDisabled={loading}
                      value={task.status}
                      onValueChange={async (val) => {
                        setLoading(true);
                        await onStatusChange(val as TaskStatusType);
                        setLoading(false);
                      }}
                    >
                      <div className="flex gap-3">
                        <Radio value="TODO" color="warning">
                          TODO
                        </Radio>
                        <Radio value="In Progress" color="secondary">
                          In Progress
                        </Radio>
                        <Radio value="Completed" color="success">
                          Completed
                        </Radio>
                      </div>
                    </RadioGroup>
                  )}
                </CardHeader>
                <CardBody className="flex flex-col gap-2">
                  <span className="font-semibold text-neutral-500">
                    Assignee:{" "}
                  </span>
                  <div className="flex justify-between my-2 gap-2 items-center">
                    {!editMode ? (
                      <User
                        className="justify-start"
                        name={task.assignedTo.name}
                        description={task.assignedTo.email}
                        avatarProps={{
                          src: task.assignedTo.avatar,
                          size: "sm",
                        }}
                      />
                    ) : (
                      <Autocomplete
                        defaultItems={[...project.members, ...project.managers]}
                        variant="faded"
                        placeholder="Select a user"
                        labelPlacement="outside"
                        selectedKey={task.assignedTo._id}
                        isRequired
                        allowsCustomValue={false}
                        onSelectionChange={(key) => {
                          if (!key) return;
                          changeAssignedTo(key.toString());
                        }}
                        isLoading={loading}
                      >
                        {(u) => (
                          <AutocompleteItem key={u._id} textValue={u.name}>
                            <div className="flex gap-2 items-center">
                              <Avatar
                                alt={u.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={u.avatar}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">{u.name}</span>
                                <span className="text-tiny text-default-400">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                    <Button
                      isIconOnly
                      variant="light"
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? <BiX size={24} /> : <BiEdit size={24} />}
                    </Button>
                  </div>
                  <span className="font-semibold ">
                    Due Date: <ReactTimeAgo date={new Date(task.dueDate)} />
                  </span>

                  <Divider className="my-1" />
                  <div className="flex gap-1">
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
                  <div className="flex flex-col items-end">
                    <p className="text-sm">
                      Created <ReactTimeAgo date={new Date(task.createdAt)} />{" "}
                    </p>
                    <p className="text-sm">
                      Updated <ReactTimeAgo date={new Date(task.updatedAt)} />
                    </p>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                isLoading={loading}
                variant="flat"
                onPress={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;
