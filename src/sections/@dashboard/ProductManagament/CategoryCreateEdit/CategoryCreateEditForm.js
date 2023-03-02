/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
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
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete } from '@mui/material';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import { FormProvider, RHFTextField, RHFUploadMultiFile } from '../../../../components/hook-form';
import { addCategoryAPI } from '../../../../Api/ApiCategory';

const STATUS_OPTION = ['Hoạt Động', 'Tạm Ẩn'];
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
    images: Yup.array().required('Giới tính không hợp lệ'),
    categoryStatus: Yup.string().required('Tên không hợp lệ'),
  });
  const defaultValues = [];
  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });
  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    // eslint-disable-next-line no-unused-vars
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentCategory]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                preview: URL.createObjectURL(file),
                categoryImage: reader.result,
              })
            )
          );
        };
      }
      acceptedFiles.map((item) => getBase64(item));
    },
    [setValue]
  );
  const formatDateNow = Moment().format('DD/MM/YYYY');
  const baseString = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const getRandomString = (length, base) => {
    let result = '';
    const baseLength = base.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(0, baseLength);
      result += base[randomIndex];
    }
    return result;
  };
  const onSubmit = async () => {
    try {
      const dataCategory = {
        id: 0,
        categoryImage: values.images[0].categoryImage,
        categoryName: values.categoryName,
        categoryCreatedAt: formatDateNow,
        categoryUpdatedAt: formatDateNow,
        categoryStatus: 'Hoạt Động' ? 1 : 2,
      };
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      await addCategoryAPI(dataCategory);
      enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
      navigate(PATH_DASHBOARD.categoryManagament.list);
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
                    // onRemove={handleRemove}
                  />
                </div>
              </div>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Controller
                name="categoryStatus"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    onChange={(event, newValue) => field.onChange(newValue)}
                    options={STATUS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Trạng Thái" {...params} />}
                  />
                )}
              />
              <LoadingButton variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
                {!isEdit ? 'Thêm Sản Phẩm' : 'Sửa Sản Phẩm'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
