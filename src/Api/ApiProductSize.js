import AxiosClient from './AxiosClient';

const END_POINT = {
  PRODUCTSIZES: 'ProductSizes',
};

export const getProductSizeAPI = () => AxiosClient.get(`${END_POINT.PRODUCTSIZES}`);

export const addProductSizeAPI = (dataAddProductSize) =>
  AxiosClient.post(`${END_POINT.PRODUCTSIZES}`, dataAddProductSize);

export const GetProductSizeProductCode = (productCode) =>
  AxiosClient.get(`${END_POINT.PRODUCTSIZES}/GetProductSizeProductCode/${productCode}`);

export const deleteProductSizeAPI = (idSize) => AxiosClient.delete(`${END_POINT.PRODUCTSIZES}/${idSize}`);

export const updateProductSizeAPI = (dataUpdateProductSize) =>
  AxiosClient.put(`${END_POINT.PRODUCTSIZES}`, dataUpdateProductSize);
