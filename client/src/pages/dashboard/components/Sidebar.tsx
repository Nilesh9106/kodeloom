import { Divider, Listbox, ListboxItem, ListboxSection } from "@nextui-org/react"
import { MdAdd, MdClose } from "react-icons/md"
import { Link } from "react-router-dom"
import useLoom from "../../../utils/context"
import { useEffect, useState } from "react"
import { getCall } from "../../../utils/api"

export default function Sidebar({ sideBar, setSideBar }: { sideBar: boolean, setSideBar: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setLoading] = useState(false)
    const projects = useLoom((state) => state.projects)
    const user = useLoom((state) => state.user)
    const setProjects = useLoom((state) => state.setProjects)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const data = await getCall(`projects/user/${user?._id}`);
            if (data) {
                setProjects(data.projects);
            }
            setLoading(false)
        })()
    }, [])


    return (
        <nav className={`${sideBar ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-20 h-full w-64 origin-left transform overflow-y-auto overflow-x-hidden bg-neutral-950 pb-10 px-1 transition md:translate-x-0 shadow `} >
            <div className="flex justify-between items-center py-4 px-2">
                <Link to="/dashboard" className="text-3xl font-bold">Kodeloom</Link>
                <button onClick={() => setSideBar(false)} className="md:hidden mt-1 hover:bg-neutral-900 p-1 rounded-full focus:scale-95">
                    <MdClose className="text-xl" />
                </button>
            </div>
            <Divider />
            {loading ? <div className="flex justify-center items-center h-40">Loading...</div> :
                <>{projects.length === 0 && <div className="flex justify-center items-center h-40">No projects found</div>}
                    {projects.length > 0 && <Listbox>
                        <ListboxSection title="Projects">
                            {projects.map((project) => (
                                <ListboxItem
                                    key={project._id}
                                    endContent={<MdAdd />}
                                >
                                    {project.name}
                                </ListboxItem>
                            ))}
                        </ListboxSection>
                    </Listbox>}
                </>}
            <Listbox>
                <ListboxSection title="Actions">
                    <ListboxItem
                        key={"add project"}
                        endContent={<MdAdd className="text-xl" />}
                    >
                        New Project
                    </ListboxItem>
                </ListboxSection>
            </Listbox>
        </nav>
    )
}
