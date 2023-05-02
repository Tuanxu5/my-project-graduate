/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, MenuItem } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { addProductAPI, updateProductAPI } from '../../../../Api/ApiProduct';
import { addProductSizeAPI, deleteProductSizeAPI } from '../../../../Api/ApiProductSize';
import { addProductColorAPI, deleteProductColorAPI } from '../../../../Api/ApiProductColor';
import { addProductImageAPI, deleteProductImageAPI } from '../../../../Api/ApiProductImage';
import { getCategoryAPI } from '../../../../Api/ApiCategory';

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

  const [dataCategory, setDataCategory] = useState([]);
  useEffect(() => {
    fetchDataCategory();
  }, []);
  const fetchDataCategory = async () => {
    setDataCategory(await getCategoryAPI());
  };
  const NewProductSchema = Yup.object().shape({
    productName: Yup.string().required('Tên không hợp lệ'),
    productGender: Yup.string().required('Giới tính không hợp lệ'),
    productDescription: Yup.string().required('Mô tả không hợp lệ'),
    images: Yup.array().min(2, 'Hình ảnh không hợp lệ'),
    productPrice: Yup.number().moreThan(0, 'Giá sản phẩm phải lớn hơn 0'),
    productQuality: Yup.number().moreThan(0, 'Số lượng phải lớn hơn 0'),
  });
  const sizeNameCurrent = [];
  currentProduct?.dataProductSize.map((item) => {
    sizeNameCurrent.push(item.sizeName);
  });
  const colorNameCurrent = [];
  currentProduct?.dataProductColor.map((item) => {
    colorNameCurrent.push(item.colorName);
  });
  const defaultValues = useMemo(
    () => ({
      id: currentProduct?.id || 0,
      productName: currentProduct?.productName || '',
      productDescription: currentProduct?.productDescription || '',
      images: currentProduct?.dataProductImage || [],
      productQuality: currentProduct?.productQuality || 0,
      productPrice: currentProduct?.productPrice || 0,
      productPriceSale: currentProduct?.productPriceSale || 0,
      productSize: sizeNameCurrent.sort() || [],
      productColor: colorNameCurrent.sort() || [],
      productStatus: currentProduct?.productStatus === 2 ? false : true || true,
      productGender:
        currentProduct?.productGender === 1
          ? 'Nam'
          : currentProduct?.productGender === 2
          ? 'Nữ'
          : currentProduct?.productGender === 3
          ? 'Trẻ em'
          : ' ',
      productCode: currentProduct?.productCode || '',
      productCategory: currentProduct?.productIdCategory || Number(dataCategory[0]?.id),
      dataProductSize: currentProduct?.dataProductSize || [],
    }),
    [currentProduct]
  );
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
  }, [isEdit, currentProduct]);

  const [productImageBase64, setProductImageBase64] = useState([]);

  const [handleDropImage, setHandleDropImage] = useState(false);
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const list = [];
      setHandleDropImage(true);
      setValue('images', []);
      function getBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          list.push({ imageProductName: e.target.result, fileName: file.path });
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
    [setValue]
  );
  const handleRemoveAll = () => {
    setValue('images', []);
  };
  const handleRemove = (file) => {
    const filteredItems = values.images?.filter((_file) => _file !== file);
    setValue('images', filteredItems);
  };
  const formatDateNow = Moment().format('MM/DD/YYYY');
  const baseString = '0123456789QWERTYUIOPASDFGHJKLZXCVBNM';
  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
  const getRandomString = (length, base) => {
    let result = '';
    const baseLength = base.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(0, baseLength);
      result += base[randomIndex];
    }
    return result;
  };
  const arrSizeOld = [];
  const arrSizeNew = [];
  currentProduct?.dataProductSize.map((item) => {
    arrSizeOld.push(item);
  });
  values.productSize.map((item) => {
    arrSizeNew.sort().push(item);
  });

  const arrColorOld = [];
  const arrColorNew = [];
  const arrImageOld = [];
  let listDataImage = [];
  currentProduct?.dataProductColor.map((item) => {
    arrColorOld.push(item);
  });
  values.productColor.map((item) => {
    arrColorNew.push(item);
  });

  currentProduct?.dataProductImage.map((item) => {
    arrImageOld.push(item);
  });

  if (isEdit && handleDropImage === false) {
    listDataImage = values.images;
  } else if (isEdit && handleDropImage === true) {
    listDataImage = productImageBase64;
  } else {
    listDataImage = productImageBase64;
  }
  const productCodeRandom = getRandomString(25, baseString);
  const onSubmit = async () => {
    try {
      setHandleDropImage(false);
      const dataProduct = {
        id: values.id,
        productName: values.productName,
        productPrice: String(values.productPrice),
        productImage: listDataImage[0]?.imageProductName || ' ',
        productDescription: values?.productDescription,
        productStatus: values?.productStatus === true ? 1 : 2,
        productVote: 0,
        productQuality: values.productQuality,
        productLove: 0,
        productIdCategory: values.productCategory,
        productCode: isEdit ? values.productCode : productCodeRandom,
        productCreatedAt: formatDateNow,
        productUpdateAt: formatDateNow,
        productGender: values.productGender === 'Nam' ? 1 : values.productGender === 'Nữ' ? 2 : 3,
      };
      arrSizeOld?.map((itemSize) => deleteProductSizeAPI(itemSize.idSize));
      arrSizeNew.map((itemSize) => {
        const dataProductSize = {
          id: 0,
          sizeName: itemSize,
          productCode: isEdit ? values.productCode : productCodeRandom,
          sizeCreatedAt: formatDateNow,
          sizeUpdatedAt: formatDateNow,
        };
        addProductSizeAPI(dataProductSize);
      });
      arrColorOld?.map((itemColor) => deleteProductColorAPI(itemColor.idColor));
      arrColorNew.map((itemColor) => {
        const dataProductColor = {
          id: 0,
          colorName: itemColor,
          productCode: isEdit ? values.productCode : productCodeRandom,
          colorCreatedAt: formatDateNow,
          colorUpdatedAt: formatDateNow,
        };
        addProductColorAPI(dataProductColor);
      });
      arrImageOld?.map((itemImage) => deleteProductImageAPI(itemImage.idImage));
      listDataImage?.map((itemImage) => {
        const dataProductImage = {
          id: 0,
          imageProductName: itemImage?.imageProductName,
          fileName: itemImage?.fileName,
          productCode: isEdit ? values.productCode : productCodeRandom,
          imageUpdatedAt: formatDateNow,
          imageCreatedAt: formatDateNow,
        };
        addProductImageAPI(dataProductImage);
      });
      isEdit ? await updateProductAPI(dataProduct) : await addProductAPI(dataProduct);
      console.log(dataProduct);
      await new Promise((resolve) => setTimeout(resolve, 250));
      reset();
      enqueueSnackbar(!isEdit ? 'Thêm thành công!' : 'Sửa thành công!');
      navigate(PATH_DASHBOARD.productManagament.list);
      console.log(123);
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
              <RHFTextField name="productName" label="Tên Sản Phẩm" />
              <div>
                <LabelStyle>Mô Tả Sản Phẩm</LabelStyle>
                <RHFEditor simple name="productDescription" />
              </div>
              <div>
                <LabelStyle>Hình Ảnh Sản Phẩm</LabelStyle>
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
                  <RHFSelect
                    fullWidth
                    name="productCategory"
                    label="Loại Sản Phẩm"
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
                  >
                    {dataCategory.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        sx={{
                          mx: 1,
                          my: 1,
                          borderRadius: 0.75,
                          typography: 'body2',
                          textTransform: 'capitalize',
                        }}
                      >
                        {option.categoryName}
                      </MenuItem>
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
