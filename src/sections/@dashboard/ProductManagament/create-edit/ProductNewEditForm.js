/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';

import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Moment from 'moment';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space } from 'antd';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { addProductAPI, updateProductAPI } from '../../../../Api/ApiProduct';
import { addProductSizeAPI, updateProductSizeAPI } from '../../../../Api/ApiProductSize';

// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../components/hook-form';

const GENDER_OPTION = ['Nam', 'Nữ', 'Trẻ em'];
const CATEGORY_OPTION = [
  { group: 'Clothing', classify: ['Shirts', 'T-shirts', 'Jeans', 'Leather'] },
  { group: 'Tailored', classify: ['Suits', 'Blazers', 'Trousers', 'Waistcoats'] },
  { group: 'Accessories', classify: ['Shoes', 'Backpacks and bags', 'Bracelets', 'Face masks'] },
];
const SIZE_OPTION = [
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
];
const COLOR_OPTION = [
  'Tím',
  'Trắng',
  'Xanh Dương',
  'Xanh Lá',
  'Cam',
  'Vàng',
  'Đỏ',
  'Xám',
  'Đen',
  'Hồng',
  'Đa Sắc',
  'Khác ...',
];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    productName: Yup.string().required('Tên không hợp lệ'),
    productGender: Yup.string().required('Giới tính không hợp lệ'),
    productDescription: Yup.string().required('Mô tả không hợp lệ'),
    // images: Yup.array().min(2, 'Hình ảnh không hợp lệ'),
    productPrice: Yup.number().moreThan(0, 'Giá sản phẩm phải lớn hơn 0'),
    productQuality: Yup.number().moreThan(0, 'Số lượng phải lớn hơn 0'),
    productSize: Yup.array().required(0, 'Hình ảnh không hợp lệ'),
  });
  const hehe = [];
  // eslint-disable-next-line array-callback-return
  currentProduct?.dataProductSize.map((item) => {
    hehe.push(item.sizeName);
  });
  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id || 0,
      productName: currentProduct?.productName || '',
      productDescription: currentProduct?.productDescription || '',
      // images: currentProduct?.productImage || [],
      productQuality: currentProduct?.productQuality || 0,
      productPrice: currentProduct?.productPrice || 0,
      productPriceSale: currentProduct?.productPriceSale || 0,
      productSize: hehe || [],
      productColor: currentProduct?.productColor || [],
      productStatus: currentProduct?.productStatus === 2 ? false : true || true,
      productGender: currentProduct?.productGender || '',
      productCode: currentProduct?.productCode || '',
      productCategory: currentProduct?.productCategory || CATEGORY_OPTION[0].classify[1],
      dataProductSize: currentProduct?.dataProductSize || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );
  console.log();
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
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const [productImageBase64, setProductImageBase64] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = [];
  const handleDrop = useCallback(
    (acceptedFiles) => {
      function getBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          list.push(e.target.result);
          setProductImageBase64(list);
        };
      }
      acceptedFiles.map((item) => getBase64(item));
      setValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [list, setValue]
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
  // console.log(values);
  const arrSize1 = [];
  const arrSize2 = [];
  currentProduct?.dataProductSize.map((item) => {
    arrSize1.push(item.sizeName);
    console.log(item);
  });
  values.productSize.map((item) => {
    arrSize2.push(item.id);
    console.log(item);
  });

  const arrSize3 = arrSize2.filter((x) => arrSize1.includes(x) === false);
  const productCoderandom = getRandomString(25, baseString);
  const onSubmit = async () => {
    try {
      console.log(arrSize1);
      console.log(arrSize2);
      console.log(arrSize3);
      const dataProduct = {
        id: values.id,
        productName: values.productName,
        productPrice: String(values.productPrice),
        productImage: productImageBase64[0] || ' ',
        productDescription: values.productDescription,
        productStatus: values.productStatus === true ? 1 : 2,
        productVote: 0,
        productQuality: values.productQuality,
        productLove: 0,
        productIdCategory: 1,
        productCode: isEdit ? values.productCode : productCoderandom,
        productCreatedAt: formatDateNow,
        productUpdateAt: formatDateNow,
        productGender: values.productGender === 'Nam' ? 1 : values.productGender === 'Nữ' ? 2 : 3,
      };
      values.dataProductSize.map((item) => {
        const dataProductSize = {
          id: item.idSize,
          sizeName: item.sizeName,
          productCode: isEdit ? values.productCode : productCoderandom,
          sizeCreatedAt: formatDateNow,
          sizeUpdatedAt: formatDateNow,
        };
        // console.log(dataProductSize);
        isEdit ? updateProductSizeAPI(dataProductSize) : addProductSizeAPI(dataProductSize);
      });
      // console.log(values.productSize);

      isEdit ? await updateProductAPI(dataProduct) : await addProductAPI(dataProduct);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // reset();
      enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
      // navigate(PATH_DASHBOARD.productManagament.list);
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
              <RHFTextField name="productName" label="Tên Sản Phẩm" />
              <div>
                <LabelStyle>Mô Tả Sản Phẩm</LabelStyle>
                <RHFEditor simple name="productDescription" />
              </div>
              <div>
                <LabelStyle>Hình Ảnh Sản Phẩm</LabelStyle>
                {/* <RHFUploadMultiFile
                  name="images"
                  showPreview
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                /> */}
              </div>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }}>
              <RHFSwitch
                name="productStatus"
                label="Trạng Thái"
                labelPlacement="start"
                sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
              />
              <Stack spacing={3} mt={2}>
                <RHFTextField
                  name="productQuality"
                  label="Số Lượng Sản Phẩm"
                  placeholder="0"
                  value={getValues('productQuality') === 0 ? '' : getValues('productQuality')}
                  onChange={(event) => setValue('productQuality', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                />
                <div>
                  <RHFSelect name="productCategory" label="Loại Sản Phẩm">
                    {CATEGORY_OPTION.map((category) => (
                      <optgroup key={category.group} label={category.group}>
                        {category.classify.map((classify) => (
                          <option key={classify} value={classify}>
                            {classify}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </RHFSelect>
                </div>
                <div>
                  <LabelStyle>Giới Tính</LabelStyle>
                  <RHFRadioGroup
                    name="productGender"
                    options={GENDER_OPTION}
                    sx={{
                      '& .MuiFormControlLabel-root': { mr: 4 },
                    }}
                  />
                </div>
                <div>
                  <Controller
                    name="productSize"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={SIZE_OPTION.map((option) => option)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                          ))
                        }
                        renderInput={(params) => <TextField label="Size" {...params} />}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    name="productColor"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        multiple
                        onChange={(event, newValue) => field.onChange(newValue)}
                        options={COLOR_OPTION.map((option) => option)}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                          ))
                        }
                        renderInput={(params) => <TextField label="Màu Sắc" {...params} />}
                      />
                    )}
                  />
                </div>
              </Stack>
            </Card>

            <Card sx={{ p: 3 }}>
              <Stack spacing={3} mb={2}>
                <RHFTextField
                  name="productPrice"
                  label="Giá Sản Phẩm"
                  placeholder="0"
                  value={getValues('productPrice') === 0 ? '' : getValues('productPrice')}
                  onChange={(event) => setValue('productPrice', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
                <RHFTextField
                  name="ProductPriceSale"
                  label="Giá Khuyến Mãi"
                  placeholder="0"
                  value={getValues('ProductPriceSale') === 0 ? '' : getValues('ProductPriceSale')}
                  onChange={(event) => setValue('ProductPriceSale', Number(event.target.value))}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    type: 'number',
                  }}
                />
              </Stack>
            </Card>
            <LoadingButton variant="contained" size="large" onClick={handleSubmit(onSubmit)}>
              {!isEdit ? 'Thêm Sản Phẩm' : 'Sửa Sản Phẩm'}
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
