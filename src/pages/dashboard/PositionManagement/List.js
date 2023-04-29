/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
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
import {useDispatch, useSelector} from '../../../redux/store';
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useTable, {getComparator, emptyRows} from '../../../hooks/useTable';
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
import {getPositionAPI, deletePositionAPI} from '../../../Api/ApiPosition';
import {PositionTableRow, PositionTableToolbar} from "../../../sections/@dashboard/PositionManagement/Table";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'positionName', label: 'Chức Vụ', align: 'center'},
    {id: 'positionCreatedAt', label: 'Ngày Tạo', align: 'center'},
    {id: 'departmentId', label: 'Phòng Ban', align: 'center'},
    {id: 'positionStatus', label: 'Trạng Thái', align: 'center'},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function ListPositionManagement() {
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

    const {themeStretch} = useSettings();

    const {enqueueSnackbar} = useSnackbar();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const {isLoading} = useSelector((state) => state.product);

    const [filterName, setFilterName] = useState('');

    const [dataPosition, setDataPosition] = useState([]);

    console.log(dataPosition);
    useEffect(() => {
        fetchPosition();
    }, []);

    const fetchPosition = async () => {
        setDataPosition(await getPositionAPI());
    };
    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };
    const handleDeleteRow = async (id) => {
        const deleteRow = dataPosition.filter((row) => row.id !== id);
        await deletePositionAPI(id);
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataPosition(deleteRow);
    };

    const handleDeleteRows = async (selected) => {
        const deleteRows = dataPosition.filter((row) => !selected.includes(row.id));
        selected.map((item) => deletePositionAPI(item));
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataPosition(deleteRows);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD?.positionManagement?.edit(id));
    };

    const dataFiltered = applySortFilter({
        dataPosition,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);

    return (
        <Page title="Quản Lí Phòng Ban: Danh Sách Phòng Ban">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Quản Lí Chức Vụ"
                    links={[
                        {name: 'Trang Quản Trị', href: PATH_DASHBOARD?.root},
                        {
                            name: 'Quản Lí Chức Vụ',
                            href: PATH_DASHBOARD?.positionManagement?.list,
                        },
                        {name: 'Danh Sách Chức Vụ'},
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="eva:plus-fill"/>}
                            component={RouterLink}
                            to={PATH_DASHBOARD?.positionManagement?.create}
                        >
                            Thêm Chức Vụ
                        </Button>
                    }
                />

                <Card>
                    <PositionTableToolbar filterName={filterName} onFilterName={handleFilterName}/>
                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            {selected?.length > 0 && (
                                <TableSelectedActions
                                    numSelected={selected.length}
                                    rowCount={dataPosition.length}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            dataPosition.map((row) => row?.id)
                                        )
                                    }
                                    actions={
                                        <>
                                            <Tooltip title="Delete">
                                                <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                                                    <Iconify icon={'eva:trash-2-outline'}/>
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
                                    rowCount={dataPosition?.length}
                                    numSelected={selected?.length}
                                    onSort={onSort}
                                    onSelectAllRows={(checked) =>
                                        onSelectAllRows(
                                            checked,
                                            dataPosition?.map((row) => row?.id)
                                        )
                                    }
                                />

                                <TableBody>
                                    {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) =>
                                            row ? (
                                                <PositionTableRow
                                                    key={row.id}
                                                    row={row}
                                                    selected={selected.includes(row.id)}
                                                    onSelectRow={() => onSelectRow(row.id)}
                                                    onDeleteRow={() => handleDeleteRow(row.id)}
                                                    onEditRow={() => handleEditRow(row.id)}
                                                />
                                            ) : (
                                                !isNotFound && <TableSkeleton key={index}/>
                                            )
                                        )}
                                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, dataPosition?.length)}/>
                                    <TableNoData isNotFound={isNotFound}/>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <Box sx={{position: 'relative'}}>
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

function applySortFilter({dataPosition, comparator, filterName}) {
    const stabilizedThis = dataPosition?.map((el, index) => [el, index]);

    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    dataPosition = stabilizedThis?.map((el) => el[0]);
    if (filterName) {
        dataPosition = dataPosition?.filter(
            (item) => item?.departmentName?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1
        );
    }
    return dataPosition;
}
