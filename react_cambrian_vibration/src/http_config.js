import axios from "axios";

const http_conn = axios.create({
    baseURL: "http://localhost:8500"
});

export default http_conn;