import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label, Project } from "../../../../types/project";
import { TaskService } from "../../../../helpers/TaskService";
import { TaskFormType, TaskStatusType } from "../../../../types/task";
import { useFormik } from "formik";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Task name is required"),
  assignedTo: yup.string().required("Assignee is required"),
  labels: yup.array().min(1, "Select at least one label"),
  description: yup.string().required("Description is required"),
  dueDate: yup
    .string()
    .required("Due date is required")
    .test("future-date", "Due date must be in the future", (value) => {
      if (!value) return false;
      const today = new Date();
      const dueDate = new Date(value);
      return dueDate > today;
    }),
  project: yup.string().required("Project is required"),
  status: yup.string().required("Status is required"),
  priority: yup.string().required("Priority is required"),
});

export default function AddTask({
  project,
  onAdd,
  type,
}: {
  project: Project;
  type: TaskStatusType;
  onAdd: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [assignee, setAssignee] = useState("");
  const [initialValues, setInitialValues] = useState<TaskFormType>({
    name: "",
    assignedTo: "",
    project: project._id,
    labels: [],
    description: "",
    status: type,
    priority: "Medium",
    dueDate: "",
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      console.log(values);
      await handleSubmit(values);
    },
    enableReinitialize: true,
  });

  const handleSubmit = async (task: TaskFormType) => {
    setLoading(true);
    const data = await TaskService.createTask(task);
    if (data) {
      onAdd();
      setLoading(false);
      toast.success("Task created successfully");
      onOpenChange();
      return;
    }
    toast.error("Error creating task");
    setLoading(false);
  };
  useEffect(() => {
    setInitialValues({
      ...initialValues,
      project: project._id,
      status: type,
    });
  }, [project._id, type]);

  return (
    <>
      <Button onPress={onOpen} variant="faded" isIconOnly>
        <MdAdd className="text-xl" />
      </Button>
      <Modal
        size="3xl"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                CREATE TASK
              </ModalHeader>
              <div>
                <ModalBody>
                  <div className="flex flex-col gap-2">
                    <div>
                      <Input
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        name="name"
                        isRequired
                        label="Task name"
                        placeholder="Task name"
                        variant="faded"
                        labelPlacement="outside"
                      />
                      {formik.errors.name && (
                        <span className="text-red-500 m-2 text-sm">
                          {formik.errors.name}
                        </span>
                      )}
                    </div>
                    {/* assignee */}
                    <div>
                      <Autocomplete
                        defaultItems={[...project.members, ...project.managers]}
                        variant="faded"
                        label="Assigned to"
                        placeholder="Select a user"
                        labelPlacement="outside"
                        selectedKey={assignee}
                        isRequired
                        allowsCustomValue={false}
                        onSelectionChange={(key) => {
                          if (!key) return;
                          setAssignee(key.toString());
                          formik.setFieldValue("assignedTo", key.toString());
                        }}
                      >
                        {(user) => (
                          <AutocompleteItem
                            key={user._id}
                            textValue={user.name}
                          >
                            <div className="flex gap-2 items-center">
                              <Avatar
                                alt={user.name}
                                className="flex-shrink-0"
                                size="sm"
                                src={user.avatar}
                              />
                              <div className="flex flex-col">
                                <span className="text-small">{user.name}</span>
                                <span className="text-tiny text-default-400">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                      {formik.errors.assignedTo && (
                        <span className="text-red-500 m-2 text-sm">
                          {formik.errors.assignedTo}
                        </span>
                      )}
                    </div>

                    {/* labels */}
                    <div className="flex max-md:flex-col gap-2">
                      <div className="md:flex-1">
                        <Select
                          placeholder="Select Labels"
                          variant="faded"
                          labelPlacement="outside"
                          label="Labels"
                          selectionMode="multiple"
                          selectedKeys={formik.values.labels.map(
                            (label) => label.name
                          )}
                          onSelectionChange={(keys) => {
                            // setFilter({ ...filter, genres: Array.from(keys) as string[] })
                            const temp = Array.from(keys).map((key) => {
                              const label = project.labels.find(
                                (label) => label.name === key
                              );
                              if (label) {
                                return label as Label;
                              }
                            });
                            formik.setFieldValue("labels", temp);
                          }}
                          renderValue={(keys) => {
                            return (
                              <div className="flex gap-2">
                                {keys.map((key) => {
                                  const label = project.labels.find(
                                    (label) => label.name === key.key
                                  );
                                  if (label) {
                                    return (
                                      <Chip
                                        size="sm"
                                        style={{
                                          backgroundColor: label.color,
                                        }}
                                        className="text-white"
                                        key={key.key}
                                      >
                                        {label.name}
                                      </Chip>
                                    );
                                  }
                                })}
                              </div>
                            );
                          }}
                        >
                          {project.labels.map((label) => {
                            return (
                              <SelectItem key={label.name}>
                                <Chip
                                  style={{
                                    backgroundColor: label.color,
                                  }}
                                  className="text-white"
                                >
                                  {label.name}
                                </Chip>
                              </SelectItem>
                            );
                          })}
                        </Select>
                        {formik.errors.labels && (
                          <span className="text-red-500 m-2 text-sm">
                            {formik.errors.labels as string}
                          </span>
                        )}
                      </div>
                      {/* priority */}
                      <div className="md:flex-1">
                        <Select
                          placeholder="Select Priority"
                          variant="faded"
                          labelPlacement="outside"
                          className="md:flex-1"
                          label="Priority"
                          selectedKeys={[formik.values.priority]}
                          onSelectionChange={(keys) => {
                            formik.setFieldValue(
                              "priority",
                              Array.from(keys)[0].toString()
                            );
                          }}
                        >
                          <SelectItem key={"Low"} className="text-green-500">
                            Low
                          </SelectItem>
                          <SelectItem
                            key={"Medium"}
                            className="text-yellow-400"
                          >
                            Medium
                          </SelectItem>
                          <SelectItem key={"High"} className="text-red-500">
                            High
                          </SelectItem>
                        </Select>
                      </div>
                      {formik.errors.priority && (
                        <span className="text-red-500 m-2 text-sm">
                          {formik.errors.priority}
                        </span>
                      )}
                    </div>
                    {/* description */}
                    <div className="my-1">
                      <Textarea
                        variant={"faded"}
                        label="Description"
                        isRequired
                        labelPlacement="outside"
                        placeholder="Enter your Task description"
                        minRows={3}
                        value={formik.values.description}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "description",
                            e.currentTarget.value
                          )
                        }
                      />
                      {formik.errors.description && (
                        <span className="text-red-500 m-2 text-sm">
                          {formik.errors.description}
                        </span>
                      )}
                    </div>
                    {/* dueDate */}
                    <div>
                      <Input
                        value={formik.values.dueDate}
                        onChange={(e) =>
                          formik.setFieldValue("dueDate", e.currentTarget.value)
                        }
                        isRequired
                        label="Due Date"
                        type="date"
                        placeholder="Due Date"
                        variant="faded"
                        labelPlacement="outside"
                      />
                      {formik.errors.dueDate && (
                        <span className="text-red-500 m-2 text-sm">
                          {formik.errors.dueDate}
                        </span>
                      )}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    onPress={() => {
                      formik.handleSubmit();
                    }}
                    color="primary"
                    type="submit"
                    isLoading={loading}
                  >
                    Submit
                  </Button>
                </ModalFooter>
              </div>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
