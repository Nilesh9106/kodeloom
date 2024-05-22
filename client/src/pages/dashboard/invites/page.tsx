import { useCallback, useEffect, useState } from "react";
import { InviteService } from "../../../helpers/InviteService";
import { Invite } from "../../../types/invite";
import useLoom from "../../../utils/context";
import {
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
  User,
} from "@nextui-org/react";
import { BiDotsVertical } from "react-icons/bi";
import { toast } from "sonner";
import { MdOutlineRefresh } from "react-icons/md";

export const InvitePage = () => {
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState([] as Invite[]);
  const user = useLoom((state) => state.user);
  const setProjects = useLoom((state) => state.setProjects);
  const projects = useLoom((state) => state.projects);

  const acceptInvite = useCallback(
    async (id: string) => {
      const token = toast.loading("Accepting Invite...");
      const res = await InviteService.acceptInvite(id);
      if (res) {
        setInvites(res.invites);
        if (!projects.find((p) => p._id === res.project._id)) {
          setProjects([...projects, res.project]);
        }
        toast.success("Invite Accepted Successfully");
      }
      toast.dismiss(token);
    },
    [projects, setProjects]
  );
  const rejectInvite = useCallback(async (id: string) => {
    const token = toast.loading("Rejecting Invite...");
    const res = await InviteService.rejectInvite(id);
    if (res) {
      setInvites(res.invites);
      toast.success("Invite Rejected Successfully");
    }
    toast.dismiss(token);
  }, []);

  const fetchInvites = useCallback(async () => {
    if (!user?._id) return;

    setLoading(true);
    const res = await InviteService.getInvitesByUserId(user?._id);
    if (res) {
      setInvites(res.invites);
    }
    setLoading(false);
  }, [user?._id]);
  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);
  return (
    <div className="grid gap-4 md:px-8 sm:px-4 px-1">
      <Table
        topContent={
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold">Invites</div>
            <Button onClick={fetchInvites} isIconOnly variant="light">
              <MdOutlineRefresh className="text-xl" />
            </Button>
          </div>
        }
      >
        <TableHeader>
          <TableColumn>User</TableColumn>
          <TableColumn>Project</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody
          loadingContent={<Spinner />}
          loadingState={loading ? "loading" : "idle"}
          emptyContent="No Invites to show"
          items={invites}
        >
          {(item) => {
            return (
              <TableRow key={item._id}>
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "lg",
                      src: item.user.avatar,
                    }}
                    description={item.user.email}
                    name={item.user.name}
                  >
                    {item.user.email}
                  </User>
                </TableCell>
                <TableCell>{item.project.name}</TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={item.role == "manager" ? "primary" : "success"}
                    size="sm"
                    variant="flat"
                  >
                    {item.role}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button isIconOnly variant="light">
                        <BiDotsVertical className="text-xl text-default-500" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu variant="flat">
                      <DropdownItem
                        key="accept"
                        onClick={() => acceptInvite(item._id)}
                        color="default"
                      >
                        Accept Invite
                      </DropdownItem>
                      <DropdownItem
                        key="accept"
                        color="danger"
                        onClick={() => rejectInvite(item._id)}
                        className="text-red-500"
                      >
                        Reject Invite
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </div>
  );
};
