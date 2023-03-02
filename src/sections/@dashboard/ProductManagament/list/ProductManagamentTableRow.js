import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, Stack, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import { TableMoreMenu } from '../../../../components/table';

import Image from '../../../../components/Image';

// icon
import SvgIconStyle from '../../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

ProductManagamentTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ProductManagamentTableRow({ row, selected, onSelectRow, onViewRow, onEditRow, onDeleteRow }) {
  const theme = useTheme();

  const { productImage, productName, productPrice, productQuality, productCreatedAt, productStatus } = row;

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
        <Image disabledEffect alt={123} src={productImage} sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }} />

        <Stack>
          <Typography variant="subtitle2" noWrap>
            {productName}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell align="center">{fCurrency(productPrice)}</TableCell>
      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {productQuality > 0 ? (
          productQuality
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={(productQuality === 0 && 'error') || 'default'}
            sx={{ textTransform: 'capitalize' }}
          >
            Hết Hàng
          </Label>
        )}
      </TableCell>
      <TableCell align="center">{productCreatedAt}</TableCell>
      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(productStatus === 1 && 'success') || (productStatus === 2 && 'error') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {productStatus === 1 ? 'Hoạt Động' : 'Tạm Ẩn'}
        </Label>
      </TableCell>{' '}
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {productStatus === 2 ? (
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
                  Tạm Ẩn
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onViewRow();
                  handleCloseMenu();
                }}
              >
                <SvgIconStyle
                  src={'/icons/DashBoard/Product/ic_eyeopen.svg'}
                  sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                />
                Chi Tiết
              </MenuItem>

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
                Sửa Sản Phẩm
              </MenuItem>
              <MenuItem onClick={handleClickOpen}>
                <SvgIconStyle
                  src={'/icons/DashBoard/Product/ic_delete.svg'}
                  sx={{ width: '16px', height: '16px', marginRight: '10px' }}
                />
                Xóa Sản Phẩm
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
                    Bạn có chắc chắn xóa sản phẩm này không ?
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
