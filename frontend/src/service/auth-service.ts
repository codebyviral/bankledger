import { instance, publicInstance } from "@/api/api-client";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await publicInstance.post(`/api/auth/register`, {
    name,
    email,
    password,
  });
  return response;
};

export const loginUser = async (email: string, password: string) => {
  const response = await publicInstance.post(`/api/auth/login`, {
    email,
    password,
  });
  return response;
};

export const logoutUser = async () => {
  const response = await instance.get(`/api/auth/logout`);
  return response;
};
