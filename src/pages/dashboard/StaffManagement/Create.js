/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getProductAPI } from '../../../Api/ApiProduct';
import { GetProductSizeProductCode } from '../../../Api/ApiProductSize';
import { GetProductColorProductCode } from '../../../Api/ApiProductColor';
import { GetProductImageProductCode } from '../../../Api/ApiProductImage';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../../sections/@dashboard/StaffManagament/CreateEdit/ProductNewEditForm';
// ----------------------------------------------------------------------

export default function Create() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { productCode } = useParams();
  const [products, setProducts] = useState([]);
  const isEdit = pathname.includes('edit');

  const [productSizeProductCode, setProductSizeProductCode] = useState([]);
  const [productColorProductCode, setProductColorProductCode] = useState([]);
  const [productImageProductCode, setProductImageProductCode] = useState([]);
  useEffect(() => {
    fetchDataProduct();
  }, []);
  const fetchDataProduct = async () => {
    setProducts(await getProductAPI());
    setProductSizeProductCode(await GetProductSizeProductCode(productCode));
    setProductColorProductCode(await GetProductColorProductCode(productCode));
    setProductImageProductCode(await GetProductImageProductCode(productCode));
  };
  let dataProductSize = [];
  let dataProductColor = [];
  let dataProductImage = [];
  let currentProduct = {};
  const obj1 = products.find((product) => product.productCode === productCode);
  productSizeProductCode.map((item) => {
    dataProductSize = [...dataProductSize, { sizeName: item.sizeName, idSize: item.id }];
  });
  productColorProductCode.map((item) => {
    dataProductColor = [...dataProductColor, { colorName: item.colorName, idColor: item.id }];
  });
  productImageProductCode?.map((item) => {
    dataProductImage = [
      ...dataProductImage,
      {
        imageProductName: item.imageProductName,
        idImage: item.id,
        preview: item.imageProductName,
        fileName: item.fileName,
      },
    ];
  });
  dataProductImage = dataProductImage.sort((a, b) => {
    if (a.fileName < b.fileName) {
      return -1;
    }
    if (a.fileName > b.fileName) {
      return 1;
    }
    return 0;
  });
  const obj2 = { dataProductSize };
  const obj3 = { dataProductColor };
  const obj4 = { dataProductImage };
  currentProduct = { ...obj1, ...obj2, ...obj3, ...obj4 };
  return (
    <Page title="Quản lí nhân viên: Thêm nhân viên">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
          links={[
            { name: 'Trang quản trị', href: PATH_DASHBOARD.root },
            {
              name: 'Quản lí sản phẩm',
              href: PATH_DASHBOARD.staffManagement.list,
            },
            { name: !isEdit ? 'Thêm sản phẩm' : productCode },
          ]}
        />
        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
