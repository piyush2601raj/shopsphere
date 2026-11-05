import axios from "axios";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://shopsphere-backend-2-2wa8.onrender.com"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: API_BASE_URL,
});

export default API;
