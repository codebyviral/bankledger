import { instance } from "@/api/api-client";

export const fetchRecentTransactions = async () => {
  const response = await instance.get(`/api/transactions/recent`);
  return response;
};

export const createTransaction = async (
  email: string,
  amount: number,
  idempotencyKey: string,
  note: string,
) => {
  const response = await instance.post("/api/transactions", {
    toEmail: email,
    amount,
    idempotencyKey,
    note,
  });
  return response;
};
