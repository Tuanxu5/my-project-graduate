import AxiosClient from './AxiosClient';

const END_POINT = {
  PRODUCTSIZES: 'ProductSizes',
};

export const getProductSizeAPI = () => AxiosClient.get(`${END_POINT.PRODUCTSIZES}`);

export const addProductSizeAPI = (dataAddProductSize) =>
  AxiosClient.post(`${END_POINT.PRODUCTSIZES}`, dataAddProductSize);

export const GetProductSizeProductCode = (productCode) =>
  AxiosClient.get(`${END_POINT.PRODUCTSIZES}/GetProductSizeProductCode/${productCode}`);
// export const deleteProductAPI = (idProduct) => AxiosClient.delete(`${END_POINT.PRODUCTS}/${idProduct}`);

export const updateProductSizeAPI = (dataUpdateProductSize) =>
  AxiosClient.put(`${END_POINT.PRODUCTSIZES}`, dataUpdateProductSize);
