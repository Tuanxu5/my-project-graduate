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
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getProducts } from '../../../redux/slices/product';
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
  ProductCategoryTableRow,
  ProductCategoryTableToolbar,
} from '../../../sections/@dashboard/ProductManagament/CategoryList';
import { getCategoryAPI, deleteCategoryAPI } from '../../../Api/ApiCategory';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'categoryName', label: 'Tên Danh Mục', align: 'center' },
  { id: 'categoryCreatedAt', label: 'Ngày Tạo', align: 'center' },
  { id: 'categoryStatus', label: 'Trạng Thái', align: 'center' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
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

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.product);

  const [filterName, setFilterName] = useState('');

  const [dataCategory, setDataCategory] = useState([]);
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    fetchDataCategory();
  }, []);
  const fetchDataCategory = async () => {
    setDataCategory(await getCategoryAPI());
  };
  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };
  const handleDeleteRow = async (id) => {
    const deleteRow = dataCategory.filter((row) => row.id !== id);
    await deleteCategoryAPI(id);
    await setSelected([]);
    await setDataCategory(deleteRow);
  };

  const handleDeleteRows = async (selected) => {
    const deleteRows = dataCategory.filter((row) => !selected.includes(row.id));
    selected.map((item) => deleteCategoryAPI(item));
    await setSelected([]);
    await setDataCategory(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.categoryManagament.edit(id));
    console.log(id);
  };

  const dataFiltered = applySortFilter({
    dataCategory,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

  return (
    <Page title="Quản Lí Danh Mục: Danh Sách Danh Mục">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Quản Lí Danh Mục"
          links={[
            { name: 'Trang Quản Trị', href: PATH_DASHBOARD.root },
            {
              name: 'Quản Lí Danh Mục',
              href: PATH_DASHBOARD.productManagament.listCategory,
            },
            { name: 'Danh Sách Danh Mục' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.categoryManagament.create}
            >
              Thêm Danh Mục
            </Button>
          }
        />

        <Card>
          <ProductCategoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  numSelected={selected.length}
                  rowCount={dataCategory.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      dataCategory.map((row) => row.id)
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
                  rowCount={dataCategory.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      dataCategory.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ProductCategoryTableRow
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
                  <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, dataCategory.length)} />
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
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ dataCategory, comparator, filterName }) {
  const stabilizedThis = dataCategory.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  dataCategory = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    dataCategory = dataCategory.filter(
      (item) => item.categoryName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }
  return dataCategory;
}
