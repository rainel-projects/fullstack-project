import axios from "axios";

const API = axios.create({
  baseURL: "https://organic-fortnight-v6jqwr9www9j2x4vw-8080.app.github.dev/api"
});

export const registerUser = (data) => API.post("/register", data);
export const getUsers = () => API.get("/users");
