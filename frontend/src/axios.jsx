import axios from "axios";

const API = axios.create({
  baseURL: "https://shopsphere-backend-production-3877.up.railway.app",
});

export default API;