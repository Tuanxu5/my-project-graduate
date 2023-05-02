import AxiosClient from './AxiosClient';

const END_POINT = {
    TIMESHEETS: 'Timekeepings',
};

export const getTimeSheetsAPI = () => AxiosClient.get(`${END_POINT.TIMESHEETS}`);

export const addTimeSheetsAPI = (dataTimeSheets) => AxiosClient.post(`${END_POINT.TIMESHEETS}`, dataTimeSheets);

export const deleteTimeSheetsAPI = (idTimeSheets) => AxiosClient.delete(`${END_POINT.TIMESHEETS}/${idTimeSheets}`);

export const updateTimeSheetsAPI = (dataUpdateTimeSheets) => AxiosClient.put(`${END_POINT.TIMESHEETS}`, dataUpdateTimeSheets);
