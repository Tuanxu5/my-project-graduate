/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
    Box,
    Card,
    Table,
    Button,
    Tooltip,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    TablePagination,
} from '@mui/material';
import {useSnackbar} from "notistack";
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
    TableNoData,
    TableSkeleton,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedActions,
} from '../../../components/table';
// sections
import {
    DepartmentsTableRow,
    DepartmentsTableToolbar,
} from '../../../sections/@dashboard/DepartmentsManagement/Table';
import { getDepartmentsAPI,deleteDepartmentsAPI } from '../../../Api/ApiDepartments';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'departmentName', label: 'Tên Phòng Ban', align: 'center' },
    { id: 'departmentCreatedAt', label: 'Ngày Tạo', align: 'center' },
    { id: 'departmentNotes', label: 'Ghi Chú', align: 'center' },
    { id: 'departmentStatus', label: 'Trạng Thái', align: 'center' },
    { id: '' },
];

// ----------------------------------------------------------------------

export default function ListDepartmentsManagement() {
    const {
        page,
        order,
        orderBy,
        rowsPerPage,
        setPage,
        selected,
        setSelected,
        onSelectRow,
        onSelectAllRows,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
    } = useTable({
        defaultOrderBy: 'createdAt',
    });

    const { themeStretch } = useSettings();

    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { isLoading } = useSelector((state) => state.product);

    const [filterName, setFilterName] = useState('');

    const [dataDepartments, setDataDepartments] = useState([]);


    useEffect(() => {
        fetchDataDepartments();
    }, []);

    const fetchDataDepartments = async () => {
        setDataDepartments(await getDepartmentsAPI());
    };
    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };
    const handleDeleteRow = async (id) => {
        const deleteRow = dataDepartments.filter((row) => row.id !== id);
        await deleteDepartmentsAPI(id);
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataDepartments(deleteRow);
    };

    const handleDeleteRows = async (selected) => {
        const deleteRows = dataDepartments.filter((row) => !selected.includes(row.id));
        selected.map((item) => deleteDepartmentsAPI(item));
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataDepartments(deleteRows);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD?.departmentsManagement?.edit(id));
    };

    const dataFiltered = applySortFilter({
        dataDepartments,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);

    return (
        <Page title="Quản Lí Phòng Ban: Danh Sách Phòng Ban">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Quản Lí Phòng Ban"
                    links={[
                        { name: 'Trang Quản Trị', href: PATH_DASHBOARD?.root },
                        {
                            name: 'Quản Lí Phòng Ban',
                            href: PATH_DASHBOARD?.departmentsManagement?.list,
                        },
                        { name: 'Danh Sách Phòng Ban' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                            component={RouterLink}
                            to={PATH_DASHBOARD?.departmentsManagement?.create}
                        >
                            Thêm Phòng Ban
                        </Button>
                    }
                />

                <Card>
                    <DepartmentsTableToolbar filterName={filterName} onFilterName={handleFilterName} />
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            {selected?.length > 0 && (
                                <TableSelectedActions
                                    numSelected={selected.length}
                                    rowCount={dataDepartments.length}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            dataDepartments.map((row) => row?.id)
                                        )
                                    }
                                    actions={
                                        <>
                                            <Tooltip title="Delete">
                                                <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                                                    <Iconify icon={'eva:trash-2-outline'} />
                                                </IconButton>
                                            </Tooltip>
                                        </>
                                    }
                                />
                            )}

                            <Table>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={dataDepartments?.length}
                                    numSelected={selected?.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            dataDepartments?.map((row) => row?.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) =>
                                            row ? (
                                                <DepartmentsTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={selected.includes(row.id)}
                                                    onSelectRow={() => onSelectRow(row.id)}
                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                    onEditRow={() => handleEditRow(row.id)}
                                                />
                                            ) : (
                                                !isNotFound && <TableSkeleton key={index} />
                                            )
                                        )}
                                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, dataDepartments.length)} />
                                    <TableNoData isNotFound={isNotFound} />
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dataFiltered?.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={onChangePage}
                            onRowsPerPageChange={onChangeRowsPerPage}
                        />
                    </Box>
                </Card>
            </Container>
        </Page>
    );
}

// ----------------------------------------------------------------------

function applySortFilter({ dataDepartments, comparator, filterName }) {
    const stabilizedThis = dataDepartments?.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    dataDepartments = stabilizedThis.map((el) => el[0]);
    if (filterName) {
        dataDepartments = dataDepartments.filter(
            (item) => item.departmentName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
        );
    }
    return dataDepartments;
}
