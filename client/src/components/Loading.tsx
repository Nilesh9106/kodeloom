import { Spinner } from "@nextui-org/react";


export default function Loading() {
    return (
        <div className="flex justify-center items-center h-full py-10 w-full">
            <Spinner size="lg" color="secondary" />
        </div>
    )
}
