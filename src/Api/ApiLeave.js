import AxiosClient from './AxiosClient';

const END_POINT = {
    LEAVES: 'Leaves',
};

export const getLeaveAPI = () => AxiosClient.get(`${END_POINT.LEAVES}`);

export const addLeaveAPI = (dataAddLeave) => AxiosClient.post(`${END_POINT.LEAVES}`, dataAddLeave);

export const deleteLeaveAPI = (idLeave) => AxiosClient.delete(`${END_POINT.LEAVES}/${idLeave}`);

export const updateLeaveAPI = (dataUpdateLeave) => AxiosClient.put(`${END_POINT?.LEAVES}`, dataUpdateLeave);
