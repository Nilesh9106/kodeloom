import axios from "axios";
import { toast } from "react-toastify";

export const postCall = async (endPoint: string, data: unknown) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URI}${endPoint}`, data, {
            headers: localStorage.getItem('token') ? {
                'Authorization': `${localStorage.getItem('token')}`
            } : {}
        });
        return response.data;
    } catch (error) {
        // console.log(error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                toast.error("Session expired")
                window.location.href = '/auth'
            }
            console.log(error);
            toast.error(error.response?.data?.message ?? "Something went wrong")
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
}


export const getCall = async (endPoint: string) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URI}${endPoint}`, {
            headers: localStorage.getItem('token') ? {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            } : {}
        });
        return response.data;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                toast.error("Session expired")
                window.location.href = '/auth'
            }
            toast.error(error.response?.data?.message ?? "Something went wrong")
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
}
