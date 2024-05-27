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
import { useFormik } from "formik";
import { LoginFormType, RegisterFormType } from "../../types/auth";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .transform((value) => value?.trim().toLowerCase()),
  password: yup.string().required("Password is required"),
});

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .test(
      "whitespace",
      "Username can not contain whitespace",
      (value) => !/\s/.test(value)
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password is too short"),
  name: yup.string().required("Name is required").min(3, "Name is too short"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required")
    .transform((value) => value?.trim().toLowerCase()),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    } as LoginFormType,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      handleSubmit({
        password: values.password,
        username: values.username.trim().toLowerCase(),
      });
    },
  });

  const handleSubmit = async ({ username, password }: LoginFormType) => {
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
      <div>
        <Card>
          <CardBody>
            <Input
              isRequired
              value={formik.values.username}
              onChange={formik.handleChange}
              errorMessage={formik.touched.username && formik.errors.username}
              isInvalid={
                formik.touched.username ? !!formik.errors.username : false
              }
              name="username"
              variant="faded"
              labelPlacement="outside"
              type="text"
              label="Username"
              className="my-2"
            />
            <Input
              isRequired
              value={formik.values.password}
              onChange={formik.handleChange}
              errorMessage={formik.touched.password && formik.errors.password}
              isInvalid={
                formik.touched.password ? !!formik.errors.password : false
              }
              name="password"
              variant="faded"
              labelPlacement="outside"
              type="password"
              label="Password"
              className="my-2"
            />
          </CardBody>
          <CardFooter>
            <Button
              isLoading={loading}
              isDisabled={loading}
              onPress={() => formik.handleSubmit()}
              type="submit"
              fullWidth
              color="primary"
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      name: "",
    } as RegisterFormType,
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      handleSubmit({
        ...values,
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
      });
    },
  });

  const handleSubmit = async (body: RegisterFormType) => {
    setLoading(true);
    const res = await AuthService.register(body);
    if (res) {
      toast.success("Account created! please verify your email");
    }
    setLoading(false);
  };
  return (
    <div>
      <Card>
        <CardBody>
          <Input
            type="text"
            value={formik.values.username}
            onChange={formik.handleChange}
            errorMessage={formik.touched.username && formik.errors.username}
            isInvalid={
              formik.touched.username ? !!formik.errors.username : false
            }
            name="username"
            variant="faded"
            labelPlacement="outside"
            isRequired
            label="Username"
            className="my-2"
          />
          <Input
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            errorMessage={formik.touched.name && formik.errors.name}
            isInvalid={formik.touched.name ? !!formik.errors.name : false}
            name="name"
            isRequired
            variant="faded"
            labelPlacement="outside"
            label="Name"
            className="my-2"
          />
          <Input
            isRequired
            value={formik.values.email}
            onChange={formik.handleChange}
            errorMessage={formik.touched.email && formik.errors.email}
            isInvalid={formik.touched.email ? !!formik.errors.email : false}
            name="email"
            variant="faded"
            labelPlacement="outside"
            type="email"
            label="Email"
            className="my-2"
          />
          <Input
            isRequired
            value={formik.values.password}
            onChange={formik.handleChange}
            errorMessage={formik.touched.password && formik.errors.password}
            isInvalid={
              formik.touched.password ? !!formik.errors.password : false
            }
            name="password"
            type="password"
            label="Password"
            variant="faded"
            labelPlacement="outside"
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
            onPress={() => formik.handleSubmit()}
          >
            Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
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
