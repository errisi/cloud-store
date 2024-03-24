import { apiClient } from "@/app/http/apiClient";

async function get(userId: number, path: string) {
  return apiClient.get(`/files/${userId}`, {
    params: {
      path,
    },
  });
}

async function getPublic(fileUrl: string) {
  return apiClient.get(`/files/share/${fileUrl}`);
}

async function setPublic(id: number) {
  return apiClient.patch(`/files/share/${id}`);
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

async function updatePath(id: number, path: string) {
  return apiClient.patch(`/files/move/${id}`, {
    path
  });
}

export const filesService = {
  get,
  folderCreate,
  fileUpload,
  filesDelete,
  getPublic,
  setPublic,
  updatePath,
};
