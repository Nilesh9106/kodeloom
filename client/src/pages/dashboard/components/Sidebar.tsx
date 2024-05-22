import {
  Divider,
  Listbox,
  ListboxItem,
  ListboxSection,
} from "@nextui-org/react";
import { MdAdd, MdClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import useLoom from "../../../utils/context";
import { useCallback, useEffect, useState } from "react";
import { BsPeople } from "react-icons/bs";
import { Logo } from "../../../components/Logo";

type Props = {
  sideBar: boolean;
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ sideBar, setSideBar }: Props) {
  const [loading, setLoading] = useState(false);
  const projects = useLoom((state) => state.projects);
  const fetchProjects = useLoom((state) => state.fetchProjects);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    await fetchProjects();
    setLoading(false);
  }, [fetchProjects]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <nav
      className={`${
        sideBar ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-0 *:z-50 z-50 h-full w-64 origin-left transform overflow-y-auto overflow-x-hidden bg-neutral-950 pb-10 px-1 transition md:translate-x-0 shadow `}
    >
      <div className="flex justify-between items-center py-4 px-2">
        <Link
          onClick={fetchData}
          to="/dashboard"
          className="text-3xl font-bold flex items-center justify-center gap-3"
        >
          <Logo />
          <span>
            <span className="text-violet-500">Kode</span>
            <span>loom</span>
          </span>
        </Link>
        <button
          onClick={() => setSideBar(false)}
          className="md:hidden mt-1 hover:bg-neutral-900 p-1 rounded-full focus:scale-95"
        >
          <MdClose className="text-xl" />
        </button>
      </div>
      <Divider />

      <Listbox>
        <ListboxSection title="Actions">
          <ListboxItem
            key={"invites"}
            onClick={() => navigate("/dashboard/invites")}
            endContent={<BsPeople className="text-xl" />}
          >
            Invites
          </ListboxItem>
          <ListboxItem
            key={"add project"}
            onClick={() => navigate("/dashboard/p/create")}
            endContent={<MdAdd className="text-xl" />}
          >
            New Project
          </ListboxItem>
        </ListboxSection>
      </Listbox>
      {loading ? (
        <div className="flex justify-center items-center h-40">Loading...</div>
      ) : (
        <>
          {projects.length === 0 && (
            <div className="flex justify-center items-center h-40">
              No projects found
            </div>
          )}
          {projects.length > 0 && (
            <Listbox>
              <ListboxSection title="Projects">
                {projects.map((project) => (
                  <ListboxItem
                    key={project._id ?? ""}
                    onClick={() => navigate(`/dashboard/p/${project._id}`)}
                  >
                    {project.name}
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
          )}
        </>
      )}
    </nav>
  );
}
