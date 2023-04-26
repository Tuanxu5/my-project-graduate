import AxiosClient from './AxiosClient';

const END_POINT = {
  PRODUCTIMAGE: 'ProductImage',
};

export const getProductImageAPI = () => AxiosClient.get(`${END_POINT.PRODUCTIMAGE}`);

export const addProductImageAPI = (dataAddProductImage) =>
  AxiosClient.post(`${END_POINT.PRODUCTIMAGE}`, dataAddProductImage);

export const GetProductImageProductCode = (productCode) =>
  AxiosClient.get(`${END_POINT.PRODUCTIMAGE}/GetProductImageProductCode/${productCode}`);

export const deleteProductImageAPI = (idImage) => AxiosClient.delete(`${END_POINT.PRODUCTIMAGE}/${idImage}`);

export const updateProductImageAPI = (dataUpdateProductImage) =>
  AxiosClient.put(`${END_POINT.PRODUCTIMAGE}`, dataUpdateProductImage);
