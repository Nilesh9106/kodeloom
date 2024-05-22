import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { MdMenu, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useLoom from "../../../utils/context";

type Props = {
  sideBar: boolean;
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TopHeader({ sideBar, setSideBar }: Props) {
  const user = useLoom((state) => state.user);
  const navigate = useNavigate();
  return (
    <header className="flex w-full items-center justify-between py-3 px-4 dark:bg-neutral-900/70 backdrop-blur-lg">
      <Input
        placeholder="Search..."
        size="sm"
        type="search"
        variant="faded"
        labelPlacement="outside"
        startContent={<MdSearch className="text-xl" />}
        className="sm:w-80 w-40"
      />
      <div className="flex gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              isBordered
              size="sm"
              as="button"
              className="transition-transform"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu variant="flat">
            <DropdownItem
              key="profile"
              onClick={() => navigate(`/users/${user?.username}`)}
            >
              View Profile
            </DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem
              key="logout"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
              }}
              className="text-danger"
              color="danger"
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          isIconOnly
          variant="flat"
          size="sm"
          className="md:hidden"
          onClick={() => setSideBar(!sideBar)}
        >
          <MdMenu className="text-xl" />
        </Button>
      </div>
    </header>
  );
}
