import { Button } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService } from "../../../helpers/AuthService";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();
  const handleVerify = async () => {
    if (!token) {
      toast.error("No token found!");
      return;
    }
    setLoading(true);
    // Verify email
    const res = await AuthService.verifyEmail(token);
    if (res) {
      toast.success(res.message);
      navigate("/auth");
    }
    setLoading(false);
  };
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-default-300 rounded-lg max-w-lg mx-auto my-5">
      <h1 className="text-3xl font-bold mb-4">Verify Email</h1>
      <Button
        color="primary"
        isLoading={loading}
        onPress={() => handleVerify()}
      >
        Verify Email
      </Button>
    </div>
  );
};

export default VerifyEmail;
