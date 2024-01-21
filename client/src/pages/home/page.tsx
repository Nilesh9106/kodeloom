import { Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react"
import { useState } from "react"
import { MdAdd, MdClose, MdMenu, MdSearch } from "react-icons/md";
import { Link, Outlet } from "react-router-dom";

export default function Home() {
    const [sideBar, setSideBar] = useState(false)

    return (
        <section className="min-h-screen" x-data="{ sideBar: false }">
            <nav className={`${sideBar ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-20 h-full w-64 origin-left transform overflow-y-auto overflow-x-hidden bg-neutral-950 pb-10 px-1 transition md:translate-x-0 shadow `} >
                <div className="flex justify-between items-center py-4 px-2">
                    <Link to="/dashboard" className="text-3xl font-bold">Kodeloom</Link>
                    <button onClick={() => setSideBar(false)} className="md:hidden mt-1 hover:bg-neutral-900 p-1 rounded-full focus:scale-95">
                        <MdClose className="text-xl" />
                    </button>
                </div>
                <Divider />
                <Listbox >
                    <ListboxSection title={"Projects"} showDivider>
                        <ListboxItem key={"project1"} className="my-1">
                            <span className="text-medium">Project 1</span>
                        </ListboxItem>

                        <ListboxItem key={"project2"} className="my-1">
                            <span className="text-medium">Project 1</span>
                        </ListboxItem>
                        <ListboxItem startContent={<MdAdd className="text-xl" />} key={"project3"}>
                            <span className="text-medium">Add Project</span>
                        </ListboxItem>
                    </ListboxSection>
                    <ListboxSection title={"Actions"} showDivider>
                        <ListboxItem key={"project1"}>
                            Project 1
                        </ListboxItem>
                        <ListboxItem key={"project2"}>
                            Project 2
                        </ListboxItem>
                        <ListboxItem key={"project3"}>
                            Project 3
                        </ListboxItem>
                    </ListboxSection>
                </Listbox>
            </nav>
            <div className="ml-0 transition md:ml-64" >
                <header className="flex w-full items-center justify-between py-3 px-4 dark:bg-neutral-950/70 backdrop-blur-lg">
                    <Input placeholder="Search..." size="md" type="search" labelPlacement="outside" startContent={<MdSearch className="text-xl" />} className="sm:w-80 w-40" />
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
                                <DropdownItem key="profile">View Profile</DropdownItem>
                                <DropdownItem key="settings">Settings</DropdownItem>
                                <DropdownItem key="logout" className="text-danger" color="danger">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Button isIconOnly variant="flat" size="sm" className="md:hidden" onClick={() => setSideBar(!sideBar)}>
                            <MdMenu className="text-xl" />
                        </Button>
                    </div>

                </header>
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
            {sideBar && <div onClick={() => {
                if (sideBar) {
                    setSideBar(false);
                }
            }} className={`fixed inset-0 z-10 h-screen w-screen bg-black bg-opacity-25 md:opacity-0 ${sideBar ? "opacity-100" : "opacity-0"}`}></div>}
        </section>
    )
}
