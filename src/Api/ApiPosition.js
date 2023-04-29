import AxiosClient from './AxiosClient';

const END_POINT = {
    POSITIONS: 'Positions',
};

export const getPositionAPI = () => AxiosClient.get(`${END_POINT.POSITIONS}`);

export const addPositionAPI = (dataAddPosition) => AxiosClient.post(`${END_POINT.POSITIONS}`, dataAddPosition);

export const deletePositionAPI = (idPosition) => AxiosClient.delete(`${END_POINT.POSITIONS}/${idPosition}`);

export const updatePositionAPI = (dataUpdatePosition) => AxiosClient.put(`${END_POINT?.POSITIONS}`, dataUpdatePosition);
