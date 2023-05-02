/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {useNavigate, Link as RouterLink} from 'react-router-dom';
import {format, startOfMonth, endOfMonth, eachDayOfInterval} from 'date-fns';
import viLocale from 'date-fns/locale/vi';


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
import {useSnackbar} from 'notistack';
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
import {TimeSheetsTableRow, TimeSheetsTableToolbar} from '../../../sections/@dashboard/TimeSheetsManagement/List';
import {getTimeSheetsAPI} from "../../../Api/ApiTimeSheets";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

export default function ListTimeSheetsManagement() {
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

    const [dataTimeSheets, setDataTimeSheets] = useState([]);

    useEffect(() => {
        fetchTimeSheets();
    }, []);

    const fetchTimeSheets = async () => {
        setDataTimeSheets(await getTimeSheetsAPI());
        // setDataPosition([]);
    };
    const handleFilterName = (filterName) => {
        setFilterName(filterName);
        setPage(0);
    };
    const handleDeleteRow = async (id) => {
        const deleteRow = dataTimeSheets.filter((row) => row.id !== id);
        await deletePositionAPI(id);
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataTimeSheets(deleteRow);
    };

    const handleDeleteRows = async (selected) => {
        const deleteRows = dataTimeSheets?.filter((row) => !selected?.includes(row.id));
        selected.map((item) => deletePositionAPI(item));
        await enqueueSnackbar('Xoá thành công!');
        await setSelected([]);
        await setDataTimeSheets(deleteRows);
    };

    const handleEditRow = (id) => {
        navigate(PATH_DASHBOARD?.positionManagement?.edit(id));
    };

    const dataFiltered = applySortFilter({
        dataTimeSheets,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const isNotFound = (!dataFiltered?.length && !!filterName) || (!isLoading && !dataFiltered?.length);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const days = eachDayOfInterval({start: monthStart, end: monthEnd});
    const TABLE_HEAD = days.map(
        (day) => ({id: day, label: format(day, 'EEEE dd/MM', {locale: viLocale}), align: 'center', minWidth: 110})
    );

    const objectName={id:"staffId",label:"Tên nhân viên",align:"center",minWidth:200}
    const objectOption={id:"",label:"",align:"center"}

    TABLE_HEAD?.unshift(objectName);
    const dataTimesheets = dataFiltered.reduce((acc, curr) => {
        const existingIndex = acc.findIndex(item => item.staffId === curr.staffId);
        if (existingIndex !== -1) {
            acc[existingIndex].timesheet.push({
                timekeepingDate: curr.timekeepingDate,
                timekeepingEntryTime: curr.timekeepingEntryTime,
                timekeepingTimeOut: curr.timekeepingTimeOut
            });
        } else {
            acc.push({
                staffId: curr.staffId,
                timesheet: [{
                    timekeepingDate: curr.timekeepingDate,
                    timekeepingEntryTime: curr.timekeepingEntryTime,
                    timekeepingTimeOut: curr.timekeepingTimeOut
                }]
            });
        }
        return acc;
    }, []);
    return (
        <Page title="Quản Lí Chấm Công: Bảng công">
            <Container maxWidth={themeStretch ? false : 'lg'}>
                <HeaderBreadcrumbs
                    heading="Bảng công"
                    links={[
                        {name: 'Trang Quản Trị', href: PATH_DASHBOARD?.root},
                        {
                            name: 'Quản lí chấm công',
                            href: PATH_DASHBOARD?.positionManagement?.list,
                        },
                        {name: 'Bảng công'},
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
                    <TimeSheetsTableToolbar handleDateChange={handleDateChange} selectedDate={selectedDate} filterName={filterName} onFilterName={handleFilterName}/>
                    <Scrollbar>
                        <TableContainer>
                            <div>
                                {selected?.length > 0 && (
                                    <TableSelectedActions
                                        numSelected={selected.length}
                                        rowCount={dataTimeSheets.length}
                                        onSelectAllRows={(checked) =>
                                            onSelectAllRows(
                                                checked,
                                                dataTimeSheets.map((row) => row?.id)
                                            )
                                        }
                                        actions={
                                            <>
                                                <Tooltip title="Delete">
                                                    <IconButton color="primary"
                                                                onClick={() => handleDeleteRows(selected)}>
                                                        <Iconify icon={'eva:trash-2-outline'}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        }
                                    />
                                )}

                                <Table  style={{overflowX: 'auto'}}>
                                    <TableHeadCustom
                                        order={order}
                                        orderBy={orderBy}
                                        headLabel={TABLE_HEAD}
                                        rowCount={dataTimeSheets?.length}
                                        numSelected={selected?.length}
                                        onSort={onSort}
                                    />

                                    <TableBody>
                                        {(isLoading ? [...Array(rowsPerPage)] : dataTimesheets)
                                            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((row, index) =>
                                                row ? (
                                                    <TimeSheetsTableRow
                                                        key={row.id}
                                                        row={row}
                                                        TABLE_HEAD={TABLE_HEAD}
                                                        days={days}
                                                        dataFiltered={dataFiltered}
                                                        dataTimesheets={dataTimesheets}
                                                        selected={selected.includes(row.id)}
                                                        onSelectRow={() => onSelectRow(row.id)}
                                                        onDeleteRow={() => handleDeleteRow(row.id)}
                                                        onEditRow={() => handleEditRow(row.id)}
                                                    />
                                                ) : (
                                                    !isNotFound && <TableSkeleton key={index}/>
                                                )
                                            )}
                                        <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, dataTimeSheets?.length)}/>
                                        <TableNoData isNotFound={isNotFound}/>
                                    </TableBody>
                                </Table>
                            </div>
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

function applySortFilter({dataTimeSheets, comparator, filterName}) {
    const stabilizedThis = dataTimeSheets?.map((el, index) => [el, index]);

    stabilizedThis?.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    dataTimeSheets = stabilizedThis?.map((el) => el[0]);
    if (filterName) {
        dataTimeSheets = dataTimeSheets?.filter(
            (item) => item?.departmentName?.toLowerCase()?.indexOf(filterName?.toLowerCase()) !== -1
        );
    }
    return dataTimeSheets;
}
