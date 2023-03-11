import config from './config';
export default class ReadDataJson {
    getTypeComplain() {
        return fetch(config.backend_url_img + '/resources/assets/json/complain_type.json')
            .then((res) => res.json())
            .then((d) => d.data);
    }
}