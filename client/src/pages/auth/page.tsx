import { Tabs, Tab, Card, CardBody, Input, CardFooter, Button } from "@nextui-org/react";
import { useState } from "react";
import { postCall } from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async () => {
        setLoading(true)
        const data = await postCall("auth", { username, password });
        setLoading(false)
        if (data?.status == "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Login successful")
            navigate("/")
        } else {
            toast.error(data?.message)
        }
    }
    return (
        <Card>
            <CardBody>
                <Input isRequired value={username} onChange={(e) => setUsername(e.target.value)} type="text" label="Username" className="my-2" />
                <Input isRequired value={password} onChange={(e) => setPassword(e.target.value)} type="password" label="Password" className="my-2" />
            </CardBody>
            <CardFooter>
                <Button isLoading={loading} isDisabled={loading} onClick={handleSubmit} fullWidth color="primary" >
                    Login
                </Button>
            </CardFooter>
        </Card>
    )
}

const SignUp = () => {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setLoading(true)
        const data = await postCall("auth/register", { username, email, password, name });
        setLoading(false)
        if (data?.status == "success") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("SignUp successful")
            navigate("/")
        } else {
            toast.error(data?.message)
        }
    }
    return (
        <Card>
            <CardBody>
                <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} isRequired label="Username" className="my-2" />
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} isRequired label="Name" className="my-2" />
                <Input isRequired value={email} onChange={(e) => setEmail(e.target.value)} type="email" label="Email" className="my-2" />
                <Input isRequired value={password} onChange={(e) => setPassword(e.target.value)} type="password" label="Password" className="my-2" />
            </CardBody>
            <CardFooter>
                <Button isLoading={loading} isDisabled={loading} onClick={handleSubmit} fullWidth color="primary" >
                    Sign up
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function Auth() {
    return (
        <div className="flex max-w-xl mx-auto my-20 flex-col">
            <Tabs fullWidth className="w-full" aria-label="Options">
                <Tab key="Login" title="Login">
                    <Login />
                </Tab>
                <Tab key="SignUp" title="Sign up">
                    <SignUp />
                </Tab>
            </Tabs>
        </div>
    );
}