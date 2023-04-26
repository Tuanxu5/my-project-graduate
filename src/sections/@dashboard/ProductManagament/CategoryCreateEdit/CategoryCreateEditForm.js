/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-constant-condition */
/* eslint-disable no-plusplus */
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
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadMultiFile, RHFSelect } from '../../../../components/hook-form';
import { addCategoryAPI, updateCategoryAPI } from '../../../../Api/ApiCategory';

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

CategoryCreateEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentCategory: PropTypes.object,
};

export default function CategoryCreateEditForm({ isEdit, currentCategory }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const NewProductSchema = Yup.object().shape({
    categoryName: Yup.string().required('Tên không hợp lệ'),
    images: Yup.array().min(1, 'Hình ảnh không hợp lệ'),
    categoryStatus: Yup.number().nullable().required('Trạng thái không hợp lệ'),
  });
  const defaultValues = useMemo(
    () => ({
      id: currentCategory?.id || 0,
      categoryName: currentCategory?.categoryName || '',
      categoryStatus: currentCategory?.categoryStatus || 1,
      images: currentCategory?.images || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCategory]
  );
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
    if (isEdit && currentCategory) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentCategory, reset, defaultValues]);
  const handleDrop = useCallback(
    (acceptedFiles) => {
      function getBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setValue(
            'images',
            acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: reader.result,
              })
            )
          );
        };
      }
      acceptedFiles.map((item) => getBase64(item));
    },
    [setValue]
  );

  const formatDateNow = Moment().format('MM/DD/YYYY');
  const onSubmit = async () => {
    try {
      const dataCategory = {
        id: values.id,
        categoryImage: values.images[0]?.preview,
        categoryName: values.categoryName,
        categoryCreatedAt: formatDateNow,
        categoryUpdatedAt: formatDateNow,
        categoryStatus: values.categoryStatus,
      };
      !isEdit ? await addCategoryAPI(dataCategory) : await updateCategoryAPI(dataCategory);
      reset();
      await new Promise((resolve) => setTimeout(resolve, 250));
      navigate(PATH_DASHBOARD.categoryManagament.list);
      enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveAll = () => {
    setValue('images', []);
  };
  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };
  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="categoryName" label="Tên Danh Mục" />
              <div>
                <div>
                  <LabelStyle>Hình Ảnh Minh Họa</LabelStyle>
                  <RHFUploadMultiFile
                    name="images"
                    showPreview
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                  />
                </div>
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFSelect
                fullWidth
                name="categoryStatus"
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
                {!isEdit ? 'Thêm Danh Mục' : 'Sửa Danh Mục'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
