import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
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
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useTabs from '../../../hooks/useTabs';
import useSettings from '../../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../../hooks/useTable';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../../components/table';

// sections
import {
  ProductManagamentTableRow,
  ProductManagamentTableToolbar,
} from '../../../sections/@dashboard/ProductManagament/list';
import { getProductAPI, deleteProductAPI } from '../../../Api/ApiProduct';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  { value: 'Tất Cả', label: 'Tất Cả' },
  { value: 1, label: 'Hoạt Động' },
  { value: 2, label: 'Tạm Ẩn' },
];

const TABLE_HEAD = [
  { id: 'productName', label: 'Sản Phẩm', align: 'left' },
  { id: 'productPrice', label: 'Giá', align: 'center', width: 140 },
  { id: 'productQuality', label: 'Số Lượng', align: 'center', width: 140 },
  { id: 'productCreatedAt', label: 'Ngày Nhập', align: 'center' },
  { id: 'productStatus', label: 'Trạng Thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function ProductList() {
  const { enqueueSnackbar } = useSnackbar();
  const { themeStretch } = useSettings();
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
  } = useTable({ defaultOrderBy: 'name' });
  const [dataProduct, setDataProduct] = useState([[]]);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('Tất Cả');
  const [filterStartDate, setFilterStartDate] = useState(null);
  const [filterEndDate, setFilterEndDate] = useState(null);
  const { currentTab: filterQuality, onChangeTab: onFilterQuality } = useTabs('Tất Cả');

  // Fetch Data Product
  useEffect(() => {
    fetchDataProduct();
  }, []);
  const fetchDataProduct = async () => {
    setDataProduct(await getProductAPI());
  };
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterStatus = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleDeleteRow = async (id) => {
    const deleteRow = dataProduct.filter((row) => row.id !== id);
    await deleteProductAPI(id);
    await setSelected([]);
    await setDataProduct(deleteRow);
    enqueueSnackbar('Xóa thành công!');
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = dataProduct.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setDataProduct(deleteRows);
  };

  const handleEditRow = (productCode) => {
    navigate(PATH_DASHBOARD.productManagament.edit(productCode));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const dataFiltered = applySortFilter({
    dataProduct,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterQuality,
    filterStartDate,
    filterEndDate,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterQuality) ||
    (!dataFiltered.length && !!filterStatus);

  const runOutQuality = dataProduct.filter((item) => item.productQuality === 0).length;
  const stockingQuality = dataProduct.filter((item) => item.productQuality > 0).length;

  const TABS = [
    { value: 'Tất Cả', label: 'Tất cả', color: 'info', count: dataProduct.length },
    { value: 1, label: 'Còn hàng', color: 'success', count: stockingQuality },
    { value: 0, label: 'Hết Hàng', color: 'error', count: runOutQuality },
  ];
  return (
    <div>
      <Page title="Quản Lí Sản Phẩm: Danh Sách Sản Phẩm">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Quản Lí Sản Phẩm"
            links={[
              { name: 'Trang Quản Trị', href: PATH_DASHBOARD.root },
              { name: 'Quản Lí Sản Phẩm', href: PATH_DASHBOARD.productManagament.root },
              { name: 'Danh Sách Sản Phẩm' },
            ]}
            action={
              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.productManagament.create}
                startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Thêm Sản Phẩm
              </Button>
            }
          />
          <Card>
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterQuality}
              onChange={onFilterQuality}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  value={tab.value}
                  label={
                    <Stack spacing={1} direction="row" alignItems="center" padding="0 15px">
                      <div>{tab.label}</div> <Label color={tab.color}> {tab.count} </Label>
                    </Stack>
                  }
                />
              ))}
            </Tabs>
            <Divider />
            <ProductManagamentTableToolbar
              filterName={filterName}
              filterStatus={filterStatus}
              filterStartDate={filterStartDate}
              filterEndDate={filterEndDate}
              onFilterName={handleFilterName}
              onFilterStatus={handleFilterStatus}
              onFilterStartDate={(newValue) => {
                setFilterStartDate(newValue);
              }}
              onFilterEndDate={(newValue) => {
                setFilterEndDate(newValue);
              }}
              optionsService={SERVICE_OPTIONS}
            />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={dataProduct.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        dataProduct.map((row) => row.id)
                      )
                    }
                    actions={
                      <Stack spacing={1} direction="row">
                        <Tooltip title="Delete">
                          <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                            <Iconify icon={'eva:trash-2-outline'} />
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
                    rowCount={dataProduct.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        dataProduct.map((row) => row.id)
                      )
                    }
                  />
                  <TableBody>
                    {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <ProductManagamentTableRow
                        key={row.id}
                        row={row}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.productCode)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}
                    <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, dataProduct.length)} />
                    <TableNoData isNotFound={isNotFound} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
            <Box sx={{ position: 'relative' }}>
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

function applySortFilter({ dataProduct, comparator, filterName, filterQuality, filterStatus }) {
  const stabilizedThis = dataProduct.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  dataProduct = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    dataProduct = dataProduct.filter((item) => item.productName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterQuality !== 'Tất Cả') {
    if (filterQuality === 1) {
      dataProduct = dataProduct.filter((item) => item.productQuality > 0);
    } else if (filterQuality === 0) {
      dataProduct = dataProduct.filter((item) => item.productQuality === 0);
    }
  }
  if (filterStatus !== 'Tất Cả') {
    if (filterStatus === 1) {
      dataProduct = dataProduct.filter((item) => item.productStatus === 1);
    } else if (filterStatus === 2) {
      dataProduct = dataProduct.filter((item) => item.productStatus === 2);
    }
  }
  return dataProduct;
}
