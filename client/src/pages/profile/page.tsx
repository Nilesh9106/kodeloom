import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@nextui-org/react";
import { User } from "../../types/auth";
import { UserService } from "../../helpers/UserService";

export default function Profile() {
  const [user, setUser] = useState<User>();
  const username = useParams<{ username: string }>().username;
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    if (!username) {
      return;
    }
    const res = await UserService.getUserByUsername(username);
    if (res) {
      setUser(res.user);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {loading ? (
        <>
          {" "}
          <Spinner size="lg" />{" "}
        </>
      ) : (
        <div className="flex flex-col">
          <div className="flex gap-2">
            <h1>{user?.name}</h1>
            <h2>{user?.username}</h2>
            <h3>{user?.email}</h3>
          </div>
        </div>
      )}
    </>
  );
}
