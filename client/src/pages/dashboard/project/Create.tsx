import { Button, Chip, Input, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import useLoom from "../../../utils/context";
import { useNavigate } from "react-router-dom";
import { CreateProjectFormType } from "../../../types/project";
import { ProjectService } from "../../../helpers/ProjectService";
import { useFormik } from "formik";
import * as yup from "yup";
const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name is too short"),
  description: yup.string().required("Description is required"),
  repo: yup.string().url("Invalid URL").required("Repository is required"),
  labels: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string(),
        color: yup.string(),
      })
    )
    .min(1, "At least one label is required"),
});

export default function CreateProject() {
  const user = useLoom((state) => state.user);
  const setProjects = useLoom((state) => state.setProjects);
  const projects = useLoom((state) => state.projects);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [initialValues, setInitialValues] = useState<CreateProjectFormType>({
    name: "",
    description: "",
    repo: "",
    labels: [],
    managers: [user?._id] as string[],
    members: [],
    createdBy: user?._id || "",
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: schema,
    onSubmit: async (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  const handleSubmit = async (values: CreateProjectFormType) => {
    setLoading(true);
    const data = await ProjectService.createProject(values);
    if (data) {
      setProjects([...projects, data.project]);
      console.log(data.project);
      navigate(`/dashboard/p/${data.project._id}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?._id) {
      setInitialValues({
        ...initialValues,
        createdBy: user?._id,
        managers: [user?._id],
      });
    }
  }, [user?._id]);

  return (
    <>
      <div className="flex flex-col gap-1 lg:px-10">
        <h1 className="text-2xl font-bold ">CREATE PROJECT</h1>
        <div className="my-1 flex max-md:flex-col gap-2">
          <Input
            label="Name"
            isRequired
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            variant="faded"
            type="text"
            radius="sm"
            placeholder="Project Name"
            labelPlacement="outside"
            className="md:flex-1"
            errorMessage={formik.errors.name}
          />
          <Input
            label="Repository Link"
            isRequired
            value={formik.values.repo}
            name="repo"
            onChange={formik.handleChange}
            variant="faded"
            type="url"
            radius="sm"
            placeholder="Repository URL"
            labelPlacement="outside"
            className="md:flex-1"
            errorMessage={formik.errors.repo}
          />
        </div>
        <div className="my-1">
          <Textarea
            variant={"faded"}
            label="Description"
            isRequired
            labelPlacement="outside"
            placeholder="Enter your Project description"
            minRows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            name="description"
            errorMessage={formik.errors.description}
          />
        </div>
        <div className="my-1 flex flex-col gap-2">
          {formik.values.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 ">
              {formik.values.labels.map((label, index) => (
                <Chip
                  key={index}
                  style={{
                    color: label.color,
                  }}
                  onClose={() => {
                    formik.setFieldValue(
                      "labels",
                      formik.values.labels.filter((_, i) => i !== index)
                    );
                  }}
                  variant="flat"
                >
                  {label.name}
                </Chip>
              ))}
            </div>
          )}
          <Input
            onKeyDown={(e) => {
              if (e.key == "Enter" || e.keyCode == 188) {
                e.preventDefault();
                if (label.trim() == "") return;
                setLabel("");
                formik.setFieldValue("labels", [
                  ...formik.values.labels,
                  {
                    name: label.trim(),
                    color:
                      "#" + Math.floor(Math.random() * 16777215).toString(16),
                  },
                ]);
              }
            }}
            onChange={(e) => {
              if (
                e.currentTarget.value.charAt(
                  e.currentTarget.value.length - 1
                ) == ","
              ) {
                e.preventDefault();
                if (label.trim() == "") return;
                formik.setFieldValue("labels", [
                  ...formik.values.labels,
                  {
                    name: label.trim(),
                    color:
                      "#" + Math.floor(Math.random() * 16777215).toString(16),
                  },
                ]);
                setLabel("");
              }
              setLabel(e.currentTarget.value);
            }}
            value={label}
            label="Labels"
            variant="faded"
            type="text"
            radius="sm"
            placeholder="Labels for tasks"
            labelPlacement="outside"
            className="md:flex-1"
            errorMessage={formik.errors.labels as string}
          />
        </div>
        <Button
          color="secondary"
          className="my-2"
          variant="solid"
          onClick={() => formik.handleSubmit()}
          isLoading={loading}
        >
          {loading ? "Creating Project" : "Create Project"}
        </Button>
      </div>
    </>
  );
}
