import { apiClient } from "@/app/http/apiClient";

async function getFoldersByUserId(userId: string) {
  return apiClient.get(`/floders/${userId}`);
}

export const foldersService = {
  getFoldersByUserId,
};
