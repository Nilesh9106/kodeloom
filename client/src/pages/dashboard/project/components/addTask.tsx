import { Autocomplete, AutocompleteItem, Avatar, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import { MdAdd } from "react-icons/md";
import { Project } from "../../../../utils/interfaces";
import { useState } from "react";
import { postCall } from "../../../../utils/api";
import { toast } from "react-toastify";

type Label = {
    name: string
    color: string
}

export default function AddTask({ project, onAdd, type }: { project: Project, type: string, onAdd: () => void }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState({
        name: "",
        assignedTo: "",
        project: project._id,
        labels: [] as Label[],
        description: "",
        status: type,
        priority: "Medium",
        dueDate: "",
    })
    const handleSubmit = async (onClose: () => void) => {
        setLoading(true)
        const data = await postCall("tasks", task)
        if (data) {
            onAdd()
            setLoading(false)
            onClose()
            return;
        }
        toast.error("Error creating task");
        setLoading(false)
    }
    return (
        <>
            <Button onPress={onOpen} variant="faded" isIconOnly>
                <MdAdd className="text-xl" />
            </Button>
            <Modal size="3xl" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create Task</ModalHeader>
                            <form onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmit(onClose)
                            }} >
                                <ModalBody>
                                    <div className="flex flex-col gap-2">
                                        <Input value={task.name} onChange={(e) => setTask({ ...task, name: e.currentTarget.value })} isRequired label="Task name" placeholder="Task name" variant="faded" labelPlacement="outside" validationBehavior="native" />
                                        {/* assignee */}
                                        <Autocomplete
                                            defaultItems={[...project.members, ...project.managers]}
                                            variant="faded"
                                            label="Assigned to"
                                            placeholder="Select a user"
                                            labelPlacement="outside"
                                            selectedKey={task.assignedTo}
                                            isRequired
                                            allowsCustomValue={false}
                                            onSelectionChange={(key) => {
                                                if (!key) return;
                                                setTask({ ...task, assignedTo: key.toString() })
                                            }}
                                        >
                                            {(user) => (
                                                <AutocompleteItem key={user._id} textValue={user.name}>
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar alt={user.name} className="flex-shrink-0" size="sm" src={"https://i.pravatar.cc/150?u=a042581f4e29026704d"} />
                                                        <div className="flex flex-col">
                                                            <span className="text-small">{user.name}</span>
                                                            <span className="text-tiny text-default-400">{user.email}</span>
                                                        </div>
                                                    </div>
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>

                                        {/* labels */}
                                        <div className="flex max-md:flex-col gap-2">
                                            <Select
                                                placeholder="Select Labels"
                                                variant="faded"
                                                className="md:flex-1"
                                                labelPlacement="outside"
                                                label="Labels"
                                                selectionMode="multiple"
                                                selectedKeys={task.labels.map((label) => label.name)}
                                                onSelectionChange={(keys) => {
                                                    // setFilter({ ...filter, genres: Array.from(keys) as string[] })
                                                    const temp = Array.from(keys).map((key) => {
                                                        const label = project.labels.find((label) => label.name === key)
                                                        if (label) {
                                                            return label as Label;
                                                        }
                                                    })
                                                    setTask({ ...task, labels: temp as Label[] })

                                                }}
                                                renderValue={(keys) => {
                                                    return (
                                                        <div className="flex gap-2">
                                                            {keys.map((key) => {
                                                                const label = project.labels.find((label) => label.name === key.key)
                                                                if (label) {
                                                                    return <Chip size="sm" style={{
                                                                        backgroundColor: label.color,
                                                                    }} className="text-white">{label.name}</Chip>
                                                                }
                                                            })}
                                                        </div>
                                                    )
                                                }}
                                            >
                                                {project.labels.map((label) => {
                                                    return <SelectItem key={label.name}>
                                                        <Chip style={{
                                                            backgroundColor: label.color,
                                                        }} className="text-white">{label.name}</Chip>
                                                    </SelectItem>
                                                })}

                                            </Select>
                                            {/* priority */}
                                            <Select
                                                placeholder="Select Priority"
                                                variant="faded"
                                                labelPlacement="outside"
                                                className="md:flex-1"
                                                label="Priority"
                                                selectedKeys={[task.priority]}
                                                onSelectionChange={(keys) => {
                                                    setTask({ ...task, priority: Array.from(keys)[0].toString() })
                                                }}
                                            >
                                                <SelectItem key={"Low"} className="text-green-500">Low</SelectItem>
                                                <SelectItem key={"Medium"} className="text-yellow-400">Medium</SelectItem>
                                                <SelectItem key={"High"} className="text-red-500">High</SelectItem>
                                            </Select>
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
                                                value={task.description}
                                                onChange={(e) => setTask({ ...task, description: e.currentTarget.value })}
                                            />
                                        </div>
                                        {/* dueDate */}
                                        <Input value={task.dueDate} onChange={(e) => setTask({ ...task, dueDate: e.currentTarget.value })} isRequired label="Due Date" type="date" placeholder="Due Date" variant="faded" labelPlacement="outside" />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" type="submit" isLoading={loading}>
                                        Submit
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </>
    )
}
