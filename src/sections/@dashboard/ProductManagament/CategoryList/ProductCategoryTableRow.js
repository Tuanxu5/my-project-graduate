import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
// utils
// components
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';

import Image from '../../../../components/Image';

// icon
import SvgIconStyle from '../../../../components/SvgIconStyle';
// ----------------------------------------------------------------------

ProductCategoryTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function ProductCategoryTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { categoryName, categoryImage, categoryStatus, categoryCreatedAt } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Image disabledEffect alt={categoryName} src={categoryImage} sx={{ width: '70px', mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {categoryName}
        </Typography>
      </TableCell>

      <TableCell align="center">{categoryCreatedAt}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(categoryStatus === 1 && 'success') || 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {categoryStatus === 1 ? 'Hoạt Động' : 'Tạm Ẩn'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {categoryStatus === 2 ? (
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                  }}
                  sx={{ color: 'success.main' }}
                >
                  <SvgIconStyle
                    src={'/icons/DashBoard/Product/ic_like.svg'}
                    sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                  />
                  Hoạt Động
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <SvgIconStyle
                    src={'/icons/DashBoard/Product/ic_dislike.svg'}
                    sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                  />
                  Tạm ẩn
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <SvgIconStyle
                  src={'/icons/DashBoard/Product/ic_edit.svg'}
                  sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                />
                Sửa danh mục
              </MenuItem>
              <MenuItem onClick={handleClickOpen}>
                <SvgIconStyle
                  src={'/icons/DashBoard/Product/ic_delete.svg'}
                  sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                />
                Xóa danh mục
              </MenuItem>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>{'Xóa Sản Phẩm'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Bạn có chắc chắn xóa danh mục này không ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Hủy Bỏ</Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      onDeleteRow();
                      handleCloseMenu();
                    }}
                  >
                    Đồng Ý
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
