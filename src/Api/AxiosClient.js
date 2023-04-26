import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:7002/api/',
  timeout: 300000,
});

instance.interceptors.response.use(
  // eslint-disable-next-line arrow-body-style
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
  }
);
export default instance;
