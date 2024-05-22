/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toast } from "sonner";

export const errorHandler = <T extends any[], R>(
  func: (...args: T) => Promise<R>
): ((...args: T) => Promise<R | undefined>) => {
  return async (...args: T) => {
    try {
      return await func(...args); // Execute the passed function with arguments
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // For Development
        console.log(error.response);
        if (error.response?.status == 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        }
        toast.error(error.response?.data.message);
      } else {
        toast.error((error as Error).message);
      }
      return undefined;
    }
  };
};
