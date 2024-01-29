import { Autocomplete, AutocompleteItem, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, User as UserDesign, useDisclosure } from "@nextui-org/react";
import { Project, User } from "../../../../utils/interfaces";
import { useEffect, useState } from "react";
import { getCall, postCall } from "../../../../utils/api";
import useLoom from "../../../../utils/context";


export default function AddMember({ project }: { project: Project }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const projects = useLoom(state => state.projects)
    const setProjects = useLoom(state => state.setProjects)
    const [users, setUsers] = useState([] as User[])
    const [body, setBody] = useState({
        projectId: project._id,
        userId: "",
        role: "member"
    })
    const [loading, setLoading] = useState(false)

    const handleAddMember = async () => {
        console.log(body);
        setLoading(true)
        const data = await postCall(`projects/${body.projectId}/addMember`, {
            userId: body.userId,
            role: body.role
        });
        if (data) {
            setProjects(projects.map((p) => {
                if (p._id === body.projectId) {
                    return data.project as Project;
                }
                return p;
            }));
        }
        setLoading(false)
    }

    const handleSearch = async () => {
        setLoading(true)
        const data = await getCall(`users`);
        if (data) {
            setUsers(data.users)
        }
        setLoading(false)
    }
    useEffect(() => {
        handleSearch()
    }, [])
    return (
        <>
            <Button variant="flat" color="secondary" onPress={onOpen}>Add Member</Button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="2xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Add Member
                            </ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col gap-2">
                                    <Autocomplete
                                        variant="faded"
                                        defaultItems={users}
                                        placeholder="Search a user"
                                        selectedKey={body.userId}
                                        onSelectionChange={(val) => {

                                            setBody({ ...body, userId: val.toString() })
                                        }}
                                        labelPlacement="outside"
                                        isLoading={loading}
                                    >
                                        {(item) => <AutocompleteItem key={item._id} textValue={item.name}>
                                            <UserDesign name={item.name} description={item.email} avatarProps={{
                                                src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                                                size: "md",
                                            }}>
                                            </UserDesign>
                                        </AutocompleteItem>}
                                    </Autocomplete>
                                    <Select
                                        placeholder="Select role"
                                        className="mt-2"
                                        selectedKeys={[body.role]}
                                        onChange={(val) => {
                                            setBody({ ...body, role: val.target.value })
                                        }}
                                        labelPlacement="outside"
                                    >
                                        <SelectItem key={"member"} value="member">Member</SelectItem>
                                        <SelectItem key={"manager"} value="manager">Manager</SelectItem>
                                    </Select>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" isDisabled={loading} isLoading={loading} onPress={async () => {
                                    handleAddMember()
                                    onClose()
                                }}>
                                    Add
                                </Button>
                            </ModalFooter>

                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
