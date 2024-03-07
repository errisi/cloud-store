import { apiClient } from "@/app/http/apiClient";

async function get(userId: number, path: string) {
  return apiClient.post(`/files/${userId}`, {
    path,
  });
}

async function post(title: string, path: string, ownerId: number) {
  return apiClient.post("/files/create", { title, path, ownerId });
}

export const foldersService = {
  get,
  post
};
