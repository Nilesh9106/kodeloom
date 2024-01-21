import { Button } from "@nextui-org/react"
import React from "react";
import Tilt from 'react-parallax-tilt';
import { BiTask } from "react-icons/bi";
import { MdAccessTimeFilled, MdGroups } from "react-icons/md";
import { FaFileCode } from "react-icons/fa";
import { Link } from "react-router-dom";


const Hero = () => {
    return <>
        <section className="flex max-md:flex-col my-16  md:px-32 px-8">
            <div className="flex md:flex-1 flex-col p-2 gap-4">
                <h1 className="lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-bold text-start  lg:leading-tight">Welcome to <span className="text-violet-400">Kodeloom</span>  Where Ideas Take Flight!</h1>
                <p className="text-xl dark:text-neutral-300 text-neutral-700">Unleash the Power of Seamless Collaboration and Effortless Project Management</p>
                <Button as={Link} to={'/auth'} variant="shadow" size="lg" color="primary" className="max-w-fit my-1" >Get Started</Button>
            </div>
            <div className="md:flex-1 ">
                <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                    <div className="px-10">
                        <img src="/hero.png" alt="Kodeloom" className="" />
                    </div>
                </Tilt>
            </div>
        </section>
    </>
}

const Features = () => {
    const features = [
        {
            title: "Task Management",
            icon: <BiTask className="flex-shrink-0 w-7 h-7 text-white" />
        },
        {
            title: "Collaboration",
            icon: <MdGroups className="flex-shrink-0 w-7 h-7 text-white" />
        },
        {
            title: "File Sharing",
            icon: <FaFileCode className="flex-shrink-0 w-7 h-7 text-white" />
        },
        {
            title: "Time Tracking",
            icon: <MdAccessTimeFilled className="flex-shrink-0 w-7 h-7 text-white" />
        },
    ];

    const effect = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top; //y position within the element.
        e.currentTarget.style.background = `radial-gradient(circle at ${x}px ${y}px , rgba(255,255,255,0.1),rgba(255,255,255,0) )`;
    }


    return (
        <>
            <section className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {features.map((val, ind) => {
                        return (
                            <Tilt key={ind} scale={1.05} tiltMaxAngleX={10} tiltMaxAngleY={10}>
                                <div onMouseMove={effect} onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgb(10 10 10)";
                                }} className="h-36 sm:h-56 flex flex-col justify-center border border-gray-200 rounded-xl text-center p-4 md:p-5 dark:border-neutral-700 dark:bg-neutral-950 backdrop-blur-md">
                                    <div className="flex justify-center items-center w-12 h-12 bg-violet-600 rounded-lg mx-auto">
                                        {val.icon}
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="text-sm  sm:text-lg font-semibold text-gray-800 dark:text-gray-200">
                                            {val.title}
                                        </h3>
                                    </div>
                                </div>
                            </Tilt>
                        )
                    })}

                </div>
            </section>
        </>
    );
}


export default function LandingPage() {
    return (
        <>
            <div className="absolute top-0 left-0   -z-10 inset-0 overflow-hidden h-screen">
                <div className="absolute w-56 h-56 left-[30%] top-[30%] bg-violet-500 mix-blend-multiply filter blur-[100px] opacity-50 rounded-full"></div>
            </div>
            <Hero />
            <div className="">
                <h2 className="text-4xl leading-tight font-bold text-center">Key Features</h2>
            </div>
            <Features />
            <section className="py-16 border-t-1 dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl leading-relaxed font-bold mb-4">Ready to Streamline Your Projects?</h2>
                    <p className="text-lg dark:text-neutral-400  mb-8">Join thousands of teams using our platform to achieve project management success.</p>
                    <Button as={Link} to={'/auth'} variant="shadow" color="primary">
                        Get Started Now
                    </Button>
                </div>
            </section>

        </>
    )
}
