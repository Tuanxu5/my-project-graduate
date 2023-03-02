/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getProductAPI } from '../../../Api/ApiProduct';
import { getCategoryAPI } from '../../../Api/ApiCategory';
import { GetProductSizeProductCode } from '../../../Api/ApiProductSize';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import CategoryCreateEditForm from '../../../sections/@dashboard/ProductManagament/CategoryCreateEdit/CategoryCreateEditForm';
// ----------------------------------------------------------------------

export default function CategoryCreate() {
  const { themeStretch } = useSettings();
  const { pathname } = useLocation();
  const { id } = useParams();
  const [categorys, setCategory] = useState([]);
  const isEdit = pathname.includes('edit');

  useEffect(() => {
    fetchDataProduct();
  }, []);
  const fetchDataProduct = async () => {
    setCategory(await getCategoryAPI());
  };
  const currentCategory = categorys.find((category) => category.id === id);
  return (
    <Page title="Quản lí danh mục phẩm: Thêm danh mục">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới danh mục' : 'Sửa danh mục'}
          links={[
            { name: 'Trang quản trị', href: PATH_DASHBOARD.root },
            {
              name: 'Quản lí danh mục',
              href: PATH_DASHBOARD.categoryManagament.list,
            },
            { name: !isEdit ? 'Thêm danh mục' : id },
          ]}
        />
        <CategoryCreateEditForm isEdit={isEdit} currentCategory={currentCategory} />
      </Container>
    </Page>
  );
}
