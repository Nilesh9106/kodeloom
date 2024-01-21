import { useEffect, useState } from "react"
import { User } from "../../utils/interfaces"
import { getCall } from "../../utils/api"
import { useParams } from "react-router-dom"
import { Spinner } from "@nextui-org/react"

export default function Profile() {
    const [user, setUser] = useState<User>()
    const username = useParams<{ username: string }>().username
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getCall(`users/${username}`);
            if (data.status === "success") {
                setUser(data.user);
            }
            setLoading(false);
        })()
    }, [])
    return (
        <>
            {loading ? <> <Spinner size="lg" /> </> : (
                <div className="flex flex-col">
                    <div className="flex gap-2">
                        <h1>{user?.name}</h1>
                        <h2>{user?.username}</h2>
                        <h3>{user?.email}</h3>
                    </div>

                </div>
            )}
        </>
    )
}
