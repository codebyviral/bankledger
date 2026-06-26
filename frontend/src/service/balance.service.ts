import { instance } from "@/api/api-client";

export const fetchBalance = async () => {
  const response = await instance.get(`/api/accounts/balance`);
  return response;
};

export const fetchMonthlySpending = async () => {
  const response = await instance.get(`/api/ledger/monthly-transactions`);
  return response;
};
