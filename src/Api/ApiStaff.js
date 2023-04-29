import AxiosClient from './AxiosClient';

const END_POINT = {
    STAFFS: 'Staffs',
};

export const getStaffAPI = () => AxiosClient.get(`${END_POINT.STAFFS}`);

export const addStaffAPI = (dataStaff) => AxiosClient.post(`${END_POINT.STAFFS}`, dataStaff);

export const deleteStaffAPI = (idStaff) => AxiosClient.delete(`${END_POINT.STAFFS}/${idStaff}`);

export const updateStaffAPI = (dataUpdateStaff) => AxiosClient.put(`${END_POINT.STAFFS}`, dataUpdateStaff);
