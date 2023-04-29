/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getDepartmentsAPI } from '../../../Api/ApiDepartments';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DepartmentCreateEdit from "../../../sections/@dashboard/DepartmentsManagement/create-edit";
// ----------------------------------------------------------------------

export default function CreateDepartmentsManagement() {
    const { themeStretch } = useSettings();
    const { pathname } = useLocation();
    const { id } = useParams();
    const isEdit = pathname.includes('edit');
    const [dataDepartments, setDataDepartments] = useState([]);
    useEffect(() => {
        fetchDataCategory();
    }, []);
    const fetchDataCategory = async () => {
        setDataDepartments(await getDepartmentsAPI());
    };
    let currentDepartments = {};

    const obj1 = dataDepartments?.find((departments) => departments.id === Number(id));
    currentDepartments = { ...obj1 };

    const nameDepartments = dataDepartments?.filter((item) => item.id === Number(id))[0]?.departmentName;
    return (
        <Page title="Quản lí phòng ban: Thêm phòng ban">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm mới phòng ban' : 'Sửa phòng ban'}
                    links={[
                        { name: 'Trang quản trị', href: PATH_DASHBOARD?.root },
                        {
                            name: 'Danh mục',
                            href: PATH_DASHBOARD?.departmentsManagement?.list,
                        },
                        { name: !isEdit ? 'Thêm' : nameDepartments },
                    ]}
                />
                <DepartmentCreateEdit isEdit={isEdit} currentDepartments={currentDepartments} />
            </Container>
        </Page>
    );
}
