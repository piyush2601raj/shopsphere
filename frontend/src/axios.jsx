import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://shopsphere-backend-production-c62b.up.railway.app"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;