import AxiosClient from './AxiosClient';

const END_POINT = {
  CATEGORIES: 'Categories',
};
console.log(123);
export const getCategoryAPI = () => AxiosClient.get(`${END_POINT.CATEGORIES}`);

export const addCategoryAPI = (dataAddCategory) => AxiosClient.post(`${END_POINT.CATEGORIES}`, dataAddCategory);

export const deleteCategoryAPI = (idCategory) => AxiosClient.delete(`${END_POINT.CATEGORIES}/${idCategory}`);

export const updateCategoryAPI = (dataUpdateCategory) => AxiosClient.put(`${END_POINT.CATEGORIES}`, dataUpdateCategory);
