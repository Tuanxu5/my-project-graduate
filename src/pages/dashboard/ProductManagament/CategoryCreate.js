/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getCategoryAPI } from '../../../Api/ApiCategory';
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
  const isEdit = pathname.includes('edit');
  const [dataCategory, setDataCategory] = useState([]);
  useEffect(() => {
    fetchDataCategory();
  }, []);
  const fetchDataCategory = async () => {
    setDataCategory(await getCategoryAPI());
  };
  let currentCategory = {};
  let images = [];

  const obj1 = dataCategory?.find((category) => category.id === Number(id));
  dataCategory
    ?.filter((category) => category.id === Number(id))
    .map((item) => {
      images = [...images, { preview: item.categoryImage }];
    });
  const obj2 = { images };
  currentCategory = { ...obj1, ...obj2 };

  const nameCategory = dataCategory?.filter((item) => item.id === Number(id))[0]?.categoryName;
  return (
    <Page title="Quản lí danh mục phẩm: Thêm danh mục">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới danh mục' : 'Sửa danh mục'}
          links={[
            { name: 'Trang quản trị', href: PATH_DASHBOARD.root },
            {
              name: 'Danh mục',
              href: PATH_DASHBOARD.categoryManagament.list,
            },
            { name: !isEdit ? 'Thêm' : nameCategory },
          ]}
        />
        <CategoryCreateEditForm isEdit={isEdit} currentCategory={currentCategory} />
      </Container>
    </Page>
  );
}
