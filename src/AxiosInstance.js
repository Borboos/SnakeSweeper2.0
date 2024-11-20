import axios from "axios";
const BASE_URL = "http://localhost:5000";

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default AxiosInstance;
