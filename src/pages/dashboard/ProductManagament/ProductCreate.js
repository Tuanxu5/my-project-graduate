/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getProductAPI } from '../../../Api/ApiProduct';
import { GetProductSizeProductCode } from '../../../Api/ApiProductSize';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../../sections/@dashboard/ProductManagament/create-edit/ProductNewEditForm';
// ----------------------------------------------------------------------

export default function ProductCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { productCode } = useParams();
  const [products, setProducts] = useState([]);
  const [productSizeProductCode, setProductSizeProductCode] = useState([]);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    fetchDataProduct();
  }, []);
  const fetchDataProduct = async () => {
    setProducts(await getProductAPI());
    setProductSizeProductCode(await GetProductSizeProductCode(productCode));
  };
  let dataProductSize = [];
  let currentProduct = {};
  const obj1 = products.find((product) => product.productCode === productCode);
  productSizeProductCode.map((item) => {
    dataProductSize = [...dataProductSize, { sizeName: item.sizeName, idSize: item.id }];
  });
  const obj2 = { dataProductSize };
  currentProduct = { ...obj1, ...obj2 };
  // console.log(currentProduct);
  return (
    <Page title="Quản lí sản phẩm: Thêm sản phẩm">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
          links={[
            { name: 'Trang quản trị', href: PATH_DASHBOARD.root },
            {
              name: 'Quản lí sản phẩm',
              href: PATH_DASHBOARD.productManagament.list,
            },
            { name: !isEdit ? 'Thêm sản phẩm' : productCode },
          ]}
        />
        <ProductNewEditForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}
