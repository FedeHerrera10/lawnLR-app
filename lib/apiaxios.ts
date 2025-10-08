import axios from "axios";

//const URL = "http://192.168.201.211:8080";
const URL = "http://192.168.0.107:8080";
const api = axios.create({
    baseURL:URL 
})

export default api;