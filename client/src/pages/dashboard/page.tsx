
import { useState } from "react"

import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";

export default function Home() {
    const [sideBar, setSideBar] = useState(false)

    return (
        <section className="min-h-screen" x-data="{ sideBar: false }">
            <Sidebar sideBar={sideBar} setSideBar={setSideBar} />
            <div className="ml-0 transition md:ml-64" >
                <TopHeader sideBar={sideBar} setSideBar={setSideBar} />
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
