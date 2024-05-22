import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Image, Spinner } from "@nextui-org/react";
import { User } from "../../types/auth";
import { UserService } from "../../helpers/UserService";
import { convertToBase64 } from "../../utils/convertTobase64";
import useLoom from "../../utils/context";
import { toast } from "sonner";

export default function Profile() {
  const [userInfo, setUserInfo] = useState<User>();
  const username = useParams<{ username: string }>().username;
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string | ArrayBuffer | null>("");
  const user = useLoom((state) => state.user);
  const setUser = useLoom((state) => state.setUser);
  const handleUpdate = async () => {
    if (!userInfo?._id || !file) {
      return;
    }
    const token = toast.loading("Updating profile...");
    const res = await UserService.updateUser(userInfo._id, {
      avatar: file?.toString(),
    });
    if (res) {
      setUserInfo(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);
      setFile("");
      toast.success("Profile updated successfully");
    }
    toast.dismiss(token);
  };

  const handleFileChange = () => {
    fileRef.current?.click();
  };
  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let selectedFile: File | null = null;
    if (event.target.files && event.target.files.length > 0) {
      selectedFile = event.target.files[0];
    }
    if (selectedFile) {
      const base64 = await convertToBase64(selectedFile);
      setFile(base64);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    if (!username) {
      return;
    }
    const res = await UserService.getUserByUsername(username);
    if (res) {
      setUserInfo(res.user);
    }
    setLoading(false);
  }, [username]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <>
      {loading ? (
        <div className="flex flex-col justify-center max-w-3xl mx-auto my-5 border rounded-md pt-10 dark:border-neutral-800">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="flex flex-col justify-center max-w-3xl mx-auto my-5 border rounded-md p-5 dark:border-neutral-800">
          <div className="flex gap-10">
            <input
              ref={fileRef}
              className="hidden"
              accept="image/*"
              type="file"
              onChange={handleImageSelect}
            />
            <div className="flex justify-center items-center h-full ">
              <Image
                className="cursor-pointer size-32"
                onClick={() => {
                  if (userInfo?._id == user?._id) {
                    handleFileChange();
                  }
                }}
                src={
                  file?.toString() ||
                  userInfo?.avatar ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/768px-Windows_10_Default_Profile_Picture.svg.png"
                }
                alt={userInfo?.username}
                radius="full"
              />
            </div>
            <div className="flex flex-col justify-center ">
              <h1 className="text-2xl font-semibold mt-2">{userInfo?.name}</h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {userInfo?.email}
              </p>
              {file?.toString() !== "" && user?._id == userInfo?._id && (
                <Button
                  isLoading={loading}
                  className="my-3"
                  size={"sm"}
                  onClick={handleUpdate}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
