import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  User as UserDesign,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import useLoom from "../../../../utils/context";
import { MemberFormType, Project } from "../../../../types/project";
import { User } from "../../../../types/auth";
import { ProjectService } from "../../../../helpers/ProjectService";
import { UserService } from "../../../../helpers/UserService";
import { toast } from "sonner";

export default function AddMember({ project }: { project: Project }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const projects = useLoom((state) => state.projects);
  const setProjects = useLoom((state) => state.setProjects);
  const [users, setUsers] = useState([] as User[]);
  const [body, setBody] = useState<MemberFormType>({
    userId: "",
    role: "member",
  });
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!body.userId) {
      toast.error("Please select a user");
      return false;
    }
    if (!body.role) {
      toast.error("Please select a role");
      return false;
    }
    if (body.role != "manager" && body.role != "member") {
      toast.error("Invalid Role");
      return false;
    }
    const data = await ProjectService.addMemberToProject(project._id!, body);
    if (data) {
      setProjects(
        projects.map((p) => {
          if (p._id === project._id) {
            return data.project as Project;
          }
          return p;
        })
      );
      toast.success("Invite Sent Successfully");
      return true;
    }
    return false;
  };

  const handleSearch = async () => {
    setLoading(true);
    const data = await UserService.searchUser();
    if (data) {
      setUsers(data.users);
    }
    setLoading(false);
  };
  useEffect(() => {
    handleSearch();
  }, [isOpen]);
  return (
    <>
      <Button variant="flat" color="secondary" onPress={onOpen}>
        Add Member
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="2xl"
      >
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
                      setBody({ ...body, userId: val?.toString() ?? "" });
                    }}
                    labelPlacement="outside"
                    isLoading={loading}
                  >
                    {(item) => (
                      <AutocompleteItem key={item._id} textValue={item.name}>
                        <UserDesign
                          name={item.name}
                          description={item.email}
                          avatarProps={{
                            src: item.avatar,
                            size: "md",
                          }}
                        ></UserDesign>
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                  <Select
                    placeholder="Select role"
                    className="mt-2"
                    selectedKeys={[body.role]}
                    onChange={(val) => {
                      setBody({
                        ...body,
                        role: val.target.value as "member" | "manager",
                      });
                    }}
                    labelPlacement="outside"
                  >
                    <SelectItem key={"member"} value="member">
                      Member
                    </SelectItem>
                    <SelectItem key={"manager"} value="manager">
                      Manager
                    </SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isDisabled={loading}
                  isLoading={loading}
                  onPress={async () => {
                    setLoading(true);
                    const res = await handleAddMember();
                    setLoading(false);
                    if (res) {
                      onClose();
                    }
                  }}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
