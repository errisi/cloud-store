import { apiClient } from "@/app/http/apiClient";

async function get(userId: number, path: string) {
  return apiClient.get(`/files/${userId}`, {
    params: {
      path,
    },
  });
}

async function folderCreate(title: string, path: string, ownerId: number) {
  return apiClient.post("/files/create-folder", { title, path, ownerId });
}

async function fileUpload(
  file: FormDataEntryValue,
  path: string,
  ownerId: number
) {
  let formData = new FormData();
  formData.append("file", file);

  return apiClient.post(
    `/files/upload?ownerId=${ownerId}&path=${path}`,
    formData
  );
}

async function filesDelete(filesIds: number[]) {
  return apiClient.delete("/files/remove", {
    data: { filesIds },
  });
}

export const filesService = {
  get,
  folderCreate,
  fileUpload,
  filesDelete,
};
