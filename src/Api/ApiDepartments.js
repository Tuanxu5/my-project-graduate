import AxiosClient from './AxiosClient';

const END_POINT = {
    DEPARTMENTS: 'Departments',
};

export const getDepartmentsAPI = () => AxiosClient.get(`${END_POINT.DEPARTMENTS}`);

export const addDepartmentsAPI = (dataAddDepartments) => AxiosClient.post(`${END_POINT.DEPARTMENTS}`, dataAddDepartments);

export const deleteDepartmentsAPI = (idDepartments) => AxiosClient.delete(`${END_POINT.DEPARTMENTS}/${idDepartments}`);

export const updateDepartmentsAPI = (dataUpdateDepartments) => AxiosClient.put(`${END_POINT.DEPARTMENTS}`, dataUpdateDepartments);
