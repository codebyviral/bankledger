import { instance } from "@/api/api-client";

export const fetchRecentTransactions = async () => {
  const response = await instance.get(`/api/transactions/recent`);
  return response;
};
