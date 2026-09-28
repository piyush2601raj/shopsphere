import axios from "axios";

const API = axios.create({
  baseURL: "https://shopsphere-backend-production-c62b.up.railway.app",
});

export default API;