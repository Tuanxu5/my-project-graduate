import {useEffect, useState} from 'react';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import * as XLSX from 'xlsx';
// @mui
import {
    Box,
    Tab,
    Tabs,
    Card,
    Table,
    Stack,
    Button,
    Tooltip,
    Divider,
    TableBody,
    Container,
    IconButton,
    TableContainer,
    TablePagination, TableHead, TableRow, TableCell,
} from '@mui/material';
// routes
import {PATH_DASHBOARD} from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, {getComparator, emptyRows} from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions} from '../../../components/table';

// sections
import {
    LeaveTableRow, LeaveTableToolbar,
} from '../../../sections/@dashboard/LeaveManagement/List';
import {getProductAPI, deleteProductAPI} from '../../../Api/ApiProduct';
import {getStaffAPI} from "../../../Api/ApiStaff";
import {getPositionAPI} from "../../../Api/ApiPosition";
import {getDepartmentsAPI} from "../../../Api/ApiDepartments";
import SvgIconStyle from "../../../components/SvgIconStyle";
import {getLeaveAPI} from "../../../Api/ApiLeave";


const TABLE_HEAD = [
    {id: 'staffCode', label: 'Mã NV', align: 'center'},
    {id: 'staffName', label: 'Nhân viên', align: 'left'},
    {id: 'staffStatusType', label: 'Tổng', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Đã dùng', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Hết hạn', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Còn lại', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Tổng', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Đã dùng', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Hết hạn', align: 'center', width: 90},
    {id: 'staffStatusType', label: 'Còn lại', align: 'center', width: 90},
];

// ----------------------------------------------------------------------

export default function LeaveList() {
    const {enqueueSnackbar} = useSnackbar();
    const {themeStretch} = useSettings();
    const navigate = useNavigate();
    const {
        dense,
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
    } = useTable({defaultOrderBy: 'name'});
    const [dataLeave, setDataLeave] = useState([[]]);
    const [filterName, setFilterName] = useState('');
    const [filterStatusType, setFilterStatusType] = useState('Tất Cả');
    const [filterDepartments, setFilterDepartments] = useState('Tất Cả');
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const {currentTab: filterStatus, onChangeTab: onFilterStatus} = useTabs('Tất Cả');

    // Fetch Data Product
    useEffect(() => {
        fetchDataLeave();
    }, []);
    const fetchDataLeave = async () => {
        setDataLeave(await getLeaveAPI());
    };
    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };

    const handleFilterStatus = (event) => {
        setFilterStatusType(event.target.value);
    };
    const handleFilterDeparments = (event) => {
        setFilterDepartments(event.target.value);
    };

    const handleDeleteRow = async (id) => {
        const deleteRow = dataLeave?.filter((row) => row.id !== id);
        await deleteProductAPI(id);
        await setSelected([]);
        await setDataLeave(deleteRow);
        enqueueSnackbar('Xóa thành công!');
    };

    const handleDeleteRows = (selected) => {
        const deleteRows = dataLeave?.filter((row) => !selected.includes(row.id));
        setSelected([]);
        setDataLeave(deleteRows);
    };

    const handleEditRow = (productCode) => {
        navigate(PATH_DASHBOARD.staffManagement.edit(productCode));
    };

    const handleViewRow = (id) => {
        navigate(PATH_DASHBOARD.invoice.view(id));
    };

    const dataFiltered = applySortFilter({
        dataLeave,
        comparator: getComparator(order, orderBy),
        filterName,
        filterStatusType,
        filterStatus,
        filterStartDate,
        filterEndDate,
        filterDepartments
    });

    const isNotFound =
        (!dataFiltered.length && !!filterName) ||
        (!dataFiltered.length && !!filterStatus) ||
        (!dataFiltered.length && !!filterDepartments) ||
        (!dataFiltered.length && !!filterStatusType);

    const doingQuantity = dataLeave?.filter((item) => item?.staffStatus === 1)?.length;
    const tookBreakQuantity = dataLeave?.filter((item) => item?.staffStatus === 2)?.length;
    const longBreakQuantity = dataLeave?.filter((item) => item?.staffStatus === 3)?.length;
    const maternityLeaveQuantity = dataLeave?.filter((item) => item?.staffStatus === 4)?.length;

    const TABS = [
        {value: 'Tất Cả', label: 'Tất cả', color: 'info', count: dataLeave?.length},
        {value: 1, label: 'Đang làm', color: 'success', count: doingQuantity},
        {value: 2, label: 'Đã nghỉ', color: 'error', count: tookBreakQuantity},
        {value: 3, label: 'Nghỉ không lương dài hạn', color: 'default', count: longBreakQuantity},
        {value: 4, label: 'Nghỉ thai sản', color: 'warning', count: maternityLeaveQuantity},

    ];
    const [dataStaff, setDataStaff] = useState([]);
    useEffect(() => {
        const fetchDataDepartments = async () => {
            setDataStaff(await getStaffAPI());
        };
        fetchDataDepartments();
    }, [])
    return (
        <div>
            <Page title="Quản Lí Nhân Viên: Danh Sách Nhân Viên">
                <Container maxWidth={themeStretch ? false : 'lg'}>
                    <HeaderBreadcrumbs
                        heading="Quản Lí Phép"
                        links={[
                            {name: 'Trang quản trị', href: PATH_DASHBOARD.root},
                            {name: 'Quản lí nhân viên', href: PATH_DASHBOARD?.staffManagement?.root},
                            {name: 'Danh sách nhân viên'},
                        ]}
                    />
                    <Card>
                        <LeaveTableToolbar
                            filterName={filterName}
                            filterStatus={filterStatusType}
                            filterStartDate={filterStartDate}
                            filterEndDate={filterEndDate}
                            filterDepartments={filterDepartments}
                            onFilterName={handleFilterName}
                            onFilterStatus={handleFilterStatus}
                            onFilterDepartments={handleFilterDeparments}
                            onFilterStartDate={(newValue) => {
                                setFilterStartDate(newValue);
                            }}
                            onFilterEndDate={(newValue) => {
                                setFilterEndDate(newValue);
                            }}
                        />
                        <Scrollbar>
                            <TableContainer sx={{minWidth: 800, position: 'relative'}}>
                                {selected.length > 0 && (
                                    <TableSelectedActions
                                        dense={dense}
                                        numSelected={selected.length}
                                        rowCount={dataLeave?.length}

                                    />
                                )}
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" colSpan={2}>
                                                {""}
                                            </TableCell>
                                            <TableCell align="center" colSpan={4}>
                                                Phép năm nay
                                            </TableCell>
                                            <TableCell align="center" colSpan={4}>
                                                Phép cũ
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableHeadCustom
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={dataLeave?.length}
                                        numSelected={selected.length}
                                        onSort={onSort}

                                    />
                                    <TableBody>
                                        {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <LeaveTableRow
                                                key={row.id}
                                                row={row}
                                                dataStaff={dataStaff}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onViewRow={() => handleViewRow(row.id)}
                                                onEditRow={() => handleEditRow(row.productCode)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                            />
                                        ))}
                                        <TableEmptyRows
                                            emptyRows={emptyRows(page, rowsPerPage, dataLeave?.length)}/>
                                        <TableNoData isNotFound={isNotFound}/>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                        <Box sx={{position: 'relative'}}>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={dataFiltered.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={onChangePage}
                                onRowsPerPageChange={onChangeRowsPerPage}
                            />
                        </Box>
                    </Card>
                </Container>
            </Page>
        </div>
    );
}

// ----------------------------------------------------------------------

function applySortFilter({dataLeave, comparator, filterName, filterStatusType, filterStatus, filterDepartments}) {
    const stabilizedThis = dataLeave?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    dataLeave = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        dataLeave = dataLeave?.filter((item) => item?.staffName?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1 || item?.staffCode?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1);
    }


    if (filterStatusType !== 'Tất Cả') {
        dataLeave = dataLeave?.filter((item) => item?.staffStatusType === filterStatusType);
    }
    if (filterStatus !== 'Tất Cả') {
        dataLeave = dataLeave?.filter((item) => item?.staffStatus === filterStatus);
    }
    if (filterDepartments !== 'Tất Cả') {
        dataLeave = dataLeave.filter((item) => item?.departmentId === filterDepartments);
    }
    return dataLeave;
}
