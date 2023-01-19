import axios from "axios";

const http_conn = axios.create({
    baseURL: "http://192.168.1.121:8500"
});

export default http_conn;