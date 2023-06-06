import http from "../http_config"
import authHeader from "./auth_header";

class VibrationDataService {
    /*get(id) {
        return http.get(`/${id}`);
    }
    getbysensorid(id) {
        return http.get(`/sensorid/${id}`);
    }
    getbydaterange(data) {
        return http.post('/daterange', data);
    }*/
    getsensorbydaterange(data) {
        return http.post('/sensordata', data, {headers: authHeader()});
    }
    getsensoridlist() {
        return http.get('/sensordata/sensorids', {headers: authHeader()});
    }
    getclients() {
        return http.get('/clients', {headers: authHeader()});
    }
}

export default new VibrationDataService();