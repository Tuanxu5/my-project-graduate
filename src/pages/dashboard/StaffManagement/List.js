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
    TablePagination,
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
    StaffTableRow, StaffTableToolbar,
} from '../../../sections/@dashboard/StaffManagament/List';
import {getProductAPI, deleteProductAPI} from '../../../Api/ApiProduct';
import {getStaffAPI} from "../../../Api/ApiStaff";
import {getPositionAPI} from "../../../Api/ApiPosition";
import {getDepartmentsAPI} from "../../../Api/ApiDepartments";
import SvgIconStyle from "../../../components/SvgIconStyle";


// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
    {value: 'Tất Cả', label: 'Tất Cả'},
    {value: 1, label: 'Chính thức'},
    {value: 2, label: 'Thử việc'},
    {value: 3, label: 'Thực tập sinh'},
    {value: 4, label: 'Cộng tác viên'},
    {value: 5, label: 'Học việc'},

];

const TABLE_HEAD = [
    {id: 'staffCode', label: 'Mã NV', align: 'center'},
    {id: 'staffName', label: 'Nhân viên', align: 'left'},
    {id: 'staffNumberPhone', label: 'Thông tin liên lạc', align: 'left'},
    {id: 'positionId', label: 'Phòng ban', align: 'center'},
    {id: 'staffStatusType', label: 'Trạng thái', align: 'center'},
    {id: 'staffStatusType', label: 'Chức vụ', align: 'center'},
    {id: ''},
];

// ----------------------------------------------------------------------

export default function StaffList() {
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
    const [dataStaff, setDataStaff] = useState([[]]);
    const [filterName, setFilterName] = useState('');
    const [filterStatusType, setFilterStatusType] = useState('Tất Cả');
    const [filterDepartments, setFilterDepartments] = useState('Tất Cả');
    const [filterStartDate, setFilterStartDate] = useState(null);
    const [filterEndDate, setFilterEndDate] = useState(null);
    const {currentTab: filterStatus, onChangeTab: onFilterStatus} = useTabs('Tất Cả');

    // Fetch Data Product
    useEffect(() => {
        fetchDataStaff();
    }, []);
    const fetchDataStaff = async () => {
        setDataStaff(await getStaffAPI());
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
        const deleteRow = dataStaff?.filter((row) => row.id !== id);
        await deleteProductAPI(id);
        await setSelected([]);
        await setDataStaff(deleteRow);
        enqueueSnackbar('Xóa thành công!');
    };

    const handleDeleteRows = (selected) => {
        const deleteRows = dataStaff?.filter((row) => !selected.includes(row.id));
        setSelected([]);
        setDataStaff(deleteRows);
    };

    const handleEditRow = (productCode) => {
        navigate(PATH_DASHBOARD.staffManagement.edit(productCode));
    };

    const handleViewRow = (id) => {
        navigate(PATH_DASHBOARD.invoice.view(id));
    };

    const dataFiltered = applySortFilter({
        dataStaff,
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

    const doingQuantity = dataStaff?.filter((item) => item?.staffStatus === 1)?.length;
    const tookBreakQuantity = dataStaff?.filter((item) => item?.staffStatus === 2)?.length;
    const longBreakQuantity = dataStaff?.filter((item) => item?.staffStatus === 3)?.length;
    const maternityLeaveQuantity = dataStaff?.filter((item) => item?.staffStatus === 4)?.length;

    const TABS = [
        {value: 'Tất Cả', label: 'Tất cả', color: 'info', count: dataStaff?.length},
        {value: 1, label: 'Đang làm', color: 'success', count: doingQuantity},
        {value: 2, label: 'Đã nghỉ', color: 'error', count: tookBreakQuantity},
        {value: 3, label: 'Nghỉ không lương dài hạn', color: 'default', count: longBreakQuantity},
        {value: 4, label: 'Nghỉ thai sản', color: 'warning', count: maternityLeaveQuantity},

    ];
    const [dataPosition, setDataPosition] = useState([]);
    const [dataDepartments, setDataDepartments] = useState([]);

    const STATUS_TYPE_OPTIONS = [
        {value: 'Tất Cả', label: 'Tất Cả'},
    ].concat(dataDepartments?.map(item => ({value: item?.id, label: item?.departmentName})));
    useEffect(() => {
        const fetchDataPosition = async () => {
            setDataPosition(await getPositionAPI());
        };
        fetchDataPosition();
        const fetchDataDepartments = async () => {
            setDataDepartments(await getDepartmentsAPI());
        };
        fetchDataPosition();
        fetchDataDepartments();
    }, []);
    const data = [
        ["STT", "Họ và tên", "Mã nhân viên", "Email", "Số điện thoại", "Ngày sinh", "Giới tính", "Mã số thuế cá nhân", "Số tài khoản", "Ngân hàng", "Chi nhánh", "CCCD", "Ngày cấp", "Nơi cấp", "Địa chỉ thường trú", "Địa chỉ hiện tại", "Học vấn", "Phòng ban", "Vị trí công việc", "Loại hình nhân sự", "Trạng thái nhân sự", " Ngày bắt đầu đi làm", "Ngày nghỉ việc", "Số phép", "Ghi chú"],
    ];
    const dataExportExcel = data.concat(dataFiltered.map((obj, index) => [index, obj.staffName, obj.staffCode, obj.staffEmail, obj.staffNumberPhone, obj.staffDayOfBirthDay]));

    console.log(dataExportExcel)


    const workbook = XLSX.utils.book_new();

    const firstRow = dataExportExcel[0]; // lấy dữ liệu của hàng đầu tiên
    const boldFont = {bold: true}; // định dạng in đậm

// tạo sheet
    const worksheet = XLSX.utils.aoa_to_sheet(dataExportExcel);

// định dạng hàng đầu tiên

    // worksheet['!rows'] = [{hpt: 30, hpx: 30}];
    // worksheet['!cols'] = [  { wch: 100 },  { wch: 100 },];
    // worksheet['!margins'] = { bottom: 100, footer: 100, header: 100, left: 100, right: 100, top: 100 };
    // const numRows = dataExportExcel.length; // Số hàng của sheet
    // const rowHeight = 30; // Chiều cao cho mỗi hàng
// Tạo một mảng các đối tượng để set chiều cao cho tất cả các hàng
    // eslint-disable-next-line no-restricted-syntax
    // for (const cellAddress in worksheet) {
    //     // eslint-disable-next-line no-continue
    //     if (cellAddress[0] === "!") continue; // bỏ qua các ô metadata
    //
    //     const cell = worksheet[cellAddress];
    //     cell.s = {
    //         alignment: {
    //             horizontal: "center", // căn giữa theo chiều ngang
    //             vertical: "center" // căn giữa theo chiều dọc
    //         }
    //     };
    // }
    // const rowProps = Array(numRows).fill({ hpt: rowHeight, hpx: rowHeight * 20 });
    // worksheet['!rows'] = rowProps;]


// Add the style to the cell
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');
    const hihi = () => {
        XLSX.writeFile(workbook, 'du-lieu.xlsx');
    }
    console.log(dataFiltered);
    return (
        <div>
            <Page title="Quản Lí Nhân Viên: Danh Sách Nhân Viên">
                <Container maxWidth={themeStretch ? false : 'lg'}>
                    <HeaderBreadcrumbs
                        heading="Quản Lí Nhân Viên"
                        links={[
                            {name: 'Trang quản trị', href: PATH_DASHBOARD.root},
                            {name: 'Quản lí nhân viên', href: PATH_DASHBOARD?.staffManagement?.root},
                            {name: 'Danh sách nhân viên'},
                        ]}
                        action={
                            <div style={{display: "flex", gap: 15}}>
                                <Tooltip title="Xuất danh sách nhân viên bằng excel">
                                    <Button startIcon={<SvgIconStyle
                                        src={'/icons/ic_cloud_download.svg'}
                                        sx={{width: '20px', height: '20px'}}
                                    />}
                                            onClick={hihi} variant="outlined">
                                        Xuất
                                    </Button>
                                </Tooltip>
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to={PATH_DASHBOARD?.staffManagement.create}
                                    startIcon={<Iconify icon={'eva:plus-fill'}/>}
                                >
                                    Thêm nhân viên
                                </Button>
                            </div>
                        }
                    />
                    <Card>
                        <Tabs
                            allowScrollButtonsMobile
                            variant="scrollable"
                            scrollButtons="auto"
                            value={filterStatus}
                            onChange={onFilterStatus}
                            sx={{px: 2, bgcolor: 'background.neutral'}}
                        >
                            {TABS.map((tab) => (
                                <Tab
                                    disableRipple
                                    key={tab.value}
                                    value={tab.value}
                                    label={
                                        <Stack spacing={1} direction="row" alignItems="center" padding="0 15px">
                                            <div>{tab.label}</div>
                                            <Label color={tab.color}> {tab.count} </Label>
                                        </Stack>
                                    }
                                />
                            ))}
                        </Tabs>
                        <Divider/>
                        <StaffTableToolbar
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
                            optionsService={SERVICE_OPTIONS}
                            optionStatusType={STATUS_TYPE_OPTIONS}
                        />
                        <Scrollbar>
                            <TableContainer sx={{minWidth: 800, position: 'relative'}}>
                                {selected.length > 0 && (
                                    <TableSelectedActions
                                        dense={dense}
                                        numSelected={selected.length}
                                        rowCount={dataStaff?.length}
                                        onSelectAllRows={(checked) =>
                                            onSelectAllRows(
                                                checked,
                                                dataStaff?.map((row) => row.id)
                                            )
                                        }
                                        actions={
                                            <Stack spacing={1} direction="row">
                                                <Tooltip title="Delete">
                                                    <IconButton color="primary"
                                                                onClick={() => handleDeleteRows(selected)}>
                                                        <Iconify icon={'eva:trash-2-outline'}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        }
                                    />
                                )}
                                <Table>
                                    <TableHeadCustom
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={dataStaff?.length}
                                        numSelected={selected.length}
                                        onSort={onSort}
                                        onSelectAllRows={(checked) =>
                                            onSelectAllRows(
                                                checked,
                                                dataStaff?.map((row) => row.id)
                                            )
                                        }
                                    />
                                    <TableBody>
                                        {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                            <StaffTableRow
                                                key={row.id}
                                                row={row}
                                                dataPosition={dataPosition}
                                                dataDepartments={dataDepartments}
                                                selected={selected.includes(row.id)}
                                                onSelectRow={() => onSelectRow(row.id)}
                                                onViewRow={() => handleViewRow(row.id)}
                                                onEditRow={() => handleEditRow(row.productCode)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                            />
                                        ))}
                                        <TableEmptyRows
                                            emptyRows={emptyRows(page, rowsPerPage, dataStaff?.length)}/>
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

function applySortFilter({dataStaff, comparator, filterName, filterStatusType, filterStatus, filterDepartments}) {
    const stabilizedThis = dataStaff?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    dataStaff = stabilizedThis.map((el) => el[0]);

    if (filterName) {
        dataStaff = dataStaff?.filter((item) => item?.staffName?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1 || item?.staffCode?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1);
    }


    if (filterStatusType !== 'Tất Cả') {
        dataStaff = dataStaff?.filter((item) => item?.staffStatusType === filterStatusType);
    }
    if (filterStatus !== 'Tất Cả') {
        dataStaff = dataStaff?.filter((item) => item?.staffStatus === filterStatus);
    }
    if (filterDepartments !== 'Tất Cả') {
        dataStaff = dataStaff.filter((item) => item?.departmentId === filterDepartments);
    }
    return dataStaff;
}
