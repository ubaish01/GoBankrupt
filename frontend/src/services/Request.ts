import axios from "axios";

const BACKEND_URL = "https://api.go-bankrupt.ubaishmalik.in";

const AxiosInstance = axios.create({
  timeout: 5 * 60 * 1000, // 5 minutes
  baseURL: `${BACKEND_URL}/api/v1`,
  // baseURL: `${import.meta.env.VITE_REACT_BACKEND_URL}/api/v1`,
  withCredentials: true,
});

export const getRequest = async (url: string) => {
  try {
    const res = await AxiosInstance({
      method: "get",
      url,
    });

    return res;
  } catch (error: any) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};

export const postRequest = async (url: string, data: any) => {
  try {
    return await AxiosInstance({
      method: "post",
      url,
      data: data,
    });
  } catch (error: any) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};
export const putRequest = async (url: string, data: any) => {
  try {
    return await AxiosInstance({
      method: "put",
      url,
      data: data,
    });
  } catch (error: any) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};
export const deleteRequest = async (url: string, data: any) => {
  try {
    return await AxiosInstance({
      method: "delete",
      url,
      data: data,
    });
  } catch (error: any) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};
