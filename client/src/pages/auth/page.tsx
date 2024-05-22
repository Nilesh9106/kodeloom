import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Input,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../helpers/AuthService";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    setLoading(true);
    const res = await AuthService.login({ username, password });
    if (res) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Login successful");
      navigate("/");
    }
    setLoading(false);
  };
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Card>
          <CardBody>
            <Input
              isRequired
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              label="Username"
              className="my-2"
            />
            <Input
              isRequired
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              label="Password"
              className="my-2"
            />
          </CardBody>
          <CardFooter>
            <Button
              isLoading={loading}
              isDisabled={loading}
              type="submit"
              fullWidth
              color="primary"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const res = await AuthService.register({ email, username, password, name });
    if (res) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("SignUp successful");
      navigate("/");
    }
    setLoading(false);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Card>
        <CardBody>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isRequired
            label="Username"
            className="my-2"
          />
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
            label="Name"
            className="my-2"
          />
          <Input
            isRequired
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            label="Email"
            className="my-2"
          />
          <Input
            isRequired
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            label="Password"
            className="my-2"
          />
        </CardBody>
        <CardFooter>
          <Button
            isLoading={loading}
            isDisabled={loading}
            type="submit"
            fullWidth
            color="primary"
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default function Auth() {
  return (
    <div className="flex max-w-xl mx-auto my-20 flex-col max-sm:px-2">
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
