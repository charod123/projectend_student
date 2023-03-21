import { defineStore } from 'pinia'
import Service from '../service/api';
// import { useToast } from 'primevue/usetoast';
// const toast = useToast();
const service = new Service();
export const useStore = defineStore({
  id: 'store',
  state: () => ({
    count: 0,
    opendialog: false,
    data: {},
    submitted: false,
    role: null,
    priority: JSON.parse(sessionStorage.getItem('priority')),
    content_data: {},
    show_daiolg_reprot: false
  }),
  actions: {
    setAddData(data) {
      this.data = {};
      this.data = data;
    },
    async get_complain() {
      const res = await service.post('read/get-complain', {});
      if (res.message == 'success') {
        this.data = res.data;
        console.log(this.data);
      }
    },
    async delete(path, body) {
      try {
        const res = await service.post(path, body);
        if (res.message == 'success') {
          return res.data;
        } else {
          return res;
        }

      } catch (err) {
        return err.message;
      }

    },
    // async get(path, body) {
    //   try {
    //     const res = await service.post(path, body);
    //     if (res.message == 'success') {
    //       return res;
    //     }
    //   } catch (err) {
    //     return err.message;
    //   }

    // },
    // async create(path, body) {
    //   try {
    //     const res = await service.post(path, body);
    //     if (res.message == 'success') {
    //       return res;
    //     }
    //   } catch (err) {
    //     return err.message;
    //   }

    // }
  },
});