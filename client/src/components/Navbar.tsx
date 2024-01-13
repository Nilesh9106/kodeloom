import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { SiGithub, SiTwitter } from "react-icons/si";
import { AiOutlineSearch } from "react-icons/ai";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} className="dark:bg-neutral-950/70 bg-neutral-200/70">
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <Link to={'/'}>
                            <p className="font-semibold text-2xl">CodeLoom</p>
                        </Link>
                    </NavbarBrand>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <Link to={'/'} >
                            Home
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link to={'/'}>
                            Favorites
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link color="foreground" to={'/'}>
                            History
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Button as={Link} to={'/'} isIconOnly>
                            <AiOutlineSearch className="text-2xl" />
                        </Button>
                    </NavbarItem>
                    {localStorage.getItem("token") ? (
                        <NavbarItem>
                            <Button onClick={() => {
                                localStorage.removeItem("token")
                                localStorage.removeItem("user")
                                navigate("/auth")
                            }} color="danger" variant="flat" >Logout</Button>
                        </NavbarItem>
                    ) : (
                        <NavbarItem>
                            <Button as={Link} to="/auth" color="primary" variant="flat">
                                Login
                            </Button>
                        </NavbarItem>
                    )
                    }
                </NavbarContent>
                <NavbarMenu>
                    <NavbarMenuItem>
                        <Link className="w-full" to="/favorites" >
                            Favorites
                        </Link>
                    </NavbarMenuItem>
                    <NavbarMenuItem>
                        <Link className="w-full" to="/history" >
                            History
                        </Link>
                    </NavbarMenuItem>

                </NavbarMenu>
            </Navbar>
            <Outlet />
            <footer className="bg-white dark:bg-neutral-950 mt-5">
                <div className="container flex flex-col items-center justify-between p-6 mx-auto space-y-4 sm:space-y-0 sm:flex-row">
                    <Link to="/">
                        KodeLoom
                    </Link>

                    <p className="text-sm text-neutral-600 dark:text-neutral-300">© Copyright 2021. All Rights Reserved.</p>

                    <div className="flex -mx-2">
                        <a href="#" className="mx-2 text-neutral-600 transition-colors duration-300 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400" aria-label="Reddit">
                            <SiGithub />
                        </a>
                        <a href="#" className="mx-2 text-neutral-600 transition-colors duration-300 dark:text-neutral-300 hover:text-emerald-500 dark:hover:text-emerald-400" aria-label="Reddit">
                            <SiTwitter />
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}