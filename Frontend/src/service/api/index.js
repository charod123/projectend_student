import axios from 'axios';
import service from '../config';

const status401 = () => {
    alert('หมดเวลาการเข้าใช้ระบบ !');
    window.location.href = `http://${window.location.host}/`;
};

export default class Service {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: service.backend_url,
            timeout: 120000
        });
    }

    async post(url, data) {
        try {
            let result = await this.axiosInstance.post(url, data, {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            if (error.response.status == 401) {
                status401();
                localStorage.removeItem('details');
            }
            throw error.response;
        }
    }

    async get(url) {
        try {
            let result = await this.axiosInstance.get(url, {
                headers: {
                    'x-access-token': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }
            });
            return result.data;
        } catch (error) {
            if (error.response.status == 401) {
                status401();
            }
            throw error.response;
        }
    }
}
