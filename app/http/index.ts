import axios from "axios";

export function createClient() {
  return axios.create({
    baseURL: `${process.env.CLIENT_URL}/api`,
    withCredentials: true,
  });
}
