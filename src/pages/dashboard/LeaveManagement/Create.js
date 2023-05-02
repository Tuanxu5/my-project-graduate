/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// redux
import { getPositionAPI } from '../../../Api/ApiPosition';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import PositionCreateEdit from "../../../sections/@dashboard/PositionManagement/CreateEdit";
// ----------------------------------------------------------------------

export default function CreatePositionManagement() {
    const { themeStretch } = useSettings();
    const { pathname } = useLocation();
    const { id } = useParams();
    const isEdit = pathname.includes('edit');
    const [dataPosition, setDataPosition] = useState([]);
    useEffect(() => {
        fetchDataPosition();
    }, []);
    const fetchDataPosition = async () => {
        setDataPosition(await getPositionAPI());
    };
    let currenPosition = {};

    const obj1 = dataPosition?.find((position) => position.id === Number(id));
    currenPosition = { ...obj1 };

    const namePosition = dataPosition?.filter((item) => item.id === Number(id))[0]?.positionName;
    return (
        <Page title="Quản lí chức vụ: Thêm chức vụ">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading={!isEdit ? 'Thêm mới chức vụ' : 'Sửa chức vụ'}
                    links={[
                        { name: 'Trang quản trị', href: PATH_DASHBOARD?.root },
                        {
                            name: 'Chức vụ',
                            href: PATH_DASHBOARD?.departmentsManagement?.list,
                        },
                        { name: !isEdit ? 'Thêm' : namePosition },
                    ]}
                />
                <PositionCreateEdit isEdit={isEdit} currenPosition={currenPosition} />
            </Container>
        </Page>
    );
}
