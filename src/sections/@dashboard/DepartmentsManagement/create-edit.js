
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
import Moment from 'moment';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, MenuItem } from '@mui/material';
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadMultiFile, RHFSelect ,RHFEditor} from '../../../components/hook-form';
import { addDepartmentsAPI, updateDepartmentsAPI } from '../../../Api/ApiDepartments';

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

DepartmentCreateEdit.propTypes = {
    isEdit: PropTypes.bool,
    currentCategory: PropTypes.object,
};

export default function DepartmentCreateEdit({ isEdit, currentDepartments }) {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const NewDepartmentsSchema = Yup.object().shape({
        departmentName: Yup.string().required('Tên phòng ban không hợp lệ'),
        departmentStatus: Yup.number().nullable().required('Trạng thái không hợp lệ'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currentDepartments?.id || 0,
            departmentName: currentDepartments?.departmentName || '',
            departmentStatus: currentDepartments?.departmentStatus || 1,
            departmentNotes: currentDepartments?.departmentNotes || '',
        }),
        [currentDepartments]
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
        if (isEdit && currentDepartments) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentDepartments, reset, defaultValues]);

    const formatDateNow = Moment().format('MM/DD/YYYY');
    const onSubmit = async () => {
        try {
            const dataDepartments = {
                id: values.id,
                departmentId: (values.id).toString(),
                departmentName: values.departmentName,
                departmentNotes : values.departmentNotes,
                departmentStatus: values.departmentStatus,
                departmentCreatedAt: formatDateNow,
                departmentUpdateAt: formatDateNow,
            };
            if (!isEdit) {
                console.log(dataDepartments)
                await addDepartmentsAPI(dataDepartments);
            } else {
                await updateDepartmentsAPI(dataDepartments);
            }
            reset();
            await new Promise((resolve) => setTimeout(resolve, 250));
            navigate(PATH_DASHBOARD?.departmentsManagement?.list);
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
                            <RHFTextField name="departmentName" label="Tên Phòng Ban" />
                            <div>
                                <LabelStyle>Mô Tả Sản Phẩm</LabelStyle>
                                <RHFEditor simple name="departmentNotes" />
                            </div>
                        </Stack>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ p: 3 }}>
                        <Stack spacing={3}>
                            <RHFSelect
                                fullWidth
                                name="departmentStatus"
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
                            <LoadingButton variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
                                {!isEdit ? 'Thêm Phòng Ban' : 'Sửa Phòng Ban'}
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
