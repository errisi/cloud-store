import { createClient } from './index';

export const apiClient = createClient();

apiClient.interceptors.response.use((res) => res.data);
