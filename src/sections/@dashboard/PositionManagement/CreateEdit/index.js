
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { useNavigate } from 'react-router-dom';
import {useCallback, useEffect, useMemo, useState} from 'react';
import Moment from 'moment';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, MenuItem } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadMultiFile, RHFSelect ,RHFEditor} from '../../../../components/hook-form';
import { addPositionAPI,updatePositionAPI } from '../../../../Api/ApiPosition';
import {getDepartmentsAPI} from "../../../../Api/ApiDepartments";

const STATUS_OPTION = [
    { value: 1, label: 'Hoạt Động' },
    { value: 2, label: 'Tạm Ẩn' },
];
const LabelStyle = styled(Typography)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

PositionCreateEdit.propTypes = {
    isEdit: PropTypes.bool,
    currentCategory: PropTypes.object,
};

export default function PositionCreateEdit({ isEdit, currenPosition }) {
    const [dataDepartments, setDataDepartments] = useState([]);

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const NewDepartmentsSchema = Yup.object().shape({
        positionName: Yup.string().required('Tên chức vụ không hợp lệ'),
        positionStatus: Yup.number().nullable().required('Trạng thái không hợp lệ'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currenPosition?.id || 0,
            positionName: currenPosition?.positionName || '',
            positionStatus: currenPosition?.positionStatus || 1,
            departmentId: currenPosition?.departmentId || Number(dataDepartments[0]?.id),
            positionNotes: currenPosition?.positionNotes || ''
        }),
        [currenPosition]
    );

    const methods = useForm({
        resolver: yupResolver(NewDepartmentsSchema),
        defaultValues,
    });
    const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;
    const values = watch();

    useEffect(() => {
        fetchDataDepartments();
    }, []);
    const fetchDataDepartments = async () => {
        setDataDepartments(await getDepartmentsAPI());
    };

    useEffect(() => {
        if (isEdit && currenPosition) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currenPosition, reset, defaultValues]);

    const formatDateNow = Moment().format('MM/DD/YYYY');
    const onSubmit = async () => {
        try {
            const dataPosition = {
                id: values.id,
                positionId: (values?.id).toString(),
                positionName: values?.positionName,
                positionNotes : values?.positionNotes,
                positionStatus: values?.positionStatus,
                departmentId:values?.departmentId?.toString(),
                positionCreatedAt: formatDateNow,
                positionUpdatedAt: formatDateNow,
            };
            if (!isEdit) {
                console.log(dataPosition)
                await addPositionAPI(dataPosition);
            } else {
                await updatePositionAPI(dataPosition);
            }
            reset();
            await new Promise((resolve) => setTimeout(resolve, 250));
            navigate(PATH_DASHBOARD?.positionManagement?.list);
            enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFTextField name="positionName" label="Tên chức vụ" />
                            <div>
                                <LabelStyle>Mô tả thông tin</LabelStyle>
                                <RHFEditor simple name="positionNotes" />
                            </div>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFSelect
                                fullWidth
                                name="positionStatus"
                                label="Trạng Thái"
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            >
                                {STATUS_OPTION.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        value={option.value}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <RHFSelect
                                fullWidth
                                name="departmentId"
                                label="Phòng ban"
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                            >
                                {dataDepartments?.map((option) => (
                                    <MenuItem
                                        key={option?.id}
                                        value={option?.id}
                                        sx={{
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: 0.75,
                                            typography: 'body2',
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {option?.departmentName}
                                    </MenuItem>
                                ))}
                            </RHFSelect>
                            <LoadingButton variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
                                {!isEdit ? 'Thêm chức vụ' : 'Sửa chức vụ'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
