import AxiosClient from './AxiosClient';

const END_POINT = {
  PRODUCTS: 'Products',
};

export const getProductAPI = () => AxiosClient.get(`${END_POINT.PRODUCTS}`);

export const addProductAPI = (dataAddProduct) => AxiosClient.post(`${END_POINT.PRODUCTS}`, dataAddProduct);

export const deleteProductAPI = (idProduct) => AxiosClient.delete(`${END_POINT.PRODUCTS}/${idProduct}`);

export const updateProductAPI = (dataUpdateProduct) => AxiosClient.put(`${END_POINT.PRODUCTS}`, dataUpdateProduct);
