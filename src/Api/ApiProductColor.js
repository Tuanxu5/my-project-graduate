import AxiosClient from './AxiosClient';

const END_POINT = {
  PRODUCTCOLORS: 'ProductColors',
};

export const getProductColorAPI = () => AxiosClient.get(`${END_POINT.PRODUCTCOLORS}`);

export const addProductColorAPI = (dataAddProductColor) =>
  AxiosClient.post(`${END_POINT.PRODUCTCOLORS}`, dataAddProductColor);

export const GetProductColorProductCode = (productCode) =>
  AxiosClient.get(`${END_POINT.PRODUCTCOLORS}/GetProductColorProductCode/${productCode}`);

export const deleteProductColorAPI = (idColor) => AxiosClient.delete(`${END_POINT.PRODUCTCOLORS}/${idColor}`);

export const updateProductColorAPI = (dataUpdateProductColor) =>
  AxiosClient.put(`${END_POINT.PRODUCTCOLORS}`, dataUpdateProductColor);
