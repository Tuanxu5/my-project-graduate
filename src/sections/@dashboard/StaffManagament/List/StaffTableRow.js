/* eslint-disable global-require */
import * as React from 'react';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
// @mui
import {useTheme} from '@mui/material/styles';
import {Checkbox, TableRow, TableCell, Typography, Stack, MenuItem, Link} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
// components
import Label from '../../../../components/Label';
import {TableMoreMenu} from '../../../../components/table';

import Image from '../../../../components/Image';

// icon
import SvgIconStyle from '../../../../components/SvgIconStyle';
import {getCategoryAPI} from '../../../../Api/ApiCategory';
import {getPositionAPI} from "../../../../Api/ApiPosition";
import {getDepartmentsAPI} from "../../../../Api/ApiDepartments";

// ----------------------------------------------------------------------

StaffTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function StaffTableRow({
                                          row,
                                          selected,
                                          onSelectRow,
                                          onViewRow,
                                          onEditRow,
                                          onDeleteRow,
                                          dataDepartments, dataPosition
                                      }) {
    const theme = useTheme();

    const {
        staffCode,
        staffName,
        positionId,
        staffEmail,
        staffNumberPhone,
        staffStatus,
        staffStatusType,
        staffAvatar,
        departmentId
    } = row;

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

    const positions = dataPosition.find((position) => position.id === positionId);
    const departments = dataDepartments.find((department) => department.id === departmentId);
    const numeral = require('numeral');
    // const getDateTime = new Date(productCreatedAt);
    // const getFormatDay = `${getDateTime.getDate()} Tháng ${getDateTime.getMonth() + 1}, ${getDateTime.getFullYear()}`;
    return (
        <TableRow hover selected={selected} stickyHeader aria-label="sticky table">
            <TableCell padding="checkbox">
                <Checkbox checked={selected} onClick={onSelectRow}/>
            </TableCell>
            <TableCell align="center">{staffCode}</TableCell>
            <TableCell align="left" sx={{display: 'flex', alignItems: 'center'}}>
                <Image
                    disabledEffect
                    alt={staffName}
                    src={staffAvatar}
                    sx={{borderRadius: 1.5, width: 48, height: 48, mr: 2}}
                />
                <Stack>
                    <Stack>
                        <Typography variant="subtitle2" noWrap>
                            {staffName}
                        </Typography>
                        <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(staffStatusType === 1 && 'success') || 'warning'}
                            sx={{textTransform: 'capitalize', width: "fit-content"}}
                        >
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {staffStatusType === 1 ? "Chính thức" : staffStatusType === 2 ? "Thử việc" : staffStatusType === 3 ? "Thực tập sinh" : staffStatusType === 4 ? "Cộng tác viên" : "Học việc"}
                        </Label>
                    </Stack>
                </Stack>
            </TableCell>
            <TableCell align="left">
                <Stack>
                    <Typography variant="subtitle2" noWrap sx={{display: 'flex', alignItems: 'center'}}>
                        <SvgIconStyle
                            src={'/icons/ic_contact.svg'}
                            sx={{width: '16px', height: '16px', mr: 1}}
                        />
                        {staffEmail}
                    </Typography>
                    <Typography variant="subtitle2" noWrap sx={{display: 'flex', alignItems: 'center'}}>
                        <SvgIconStyle
                            src={'/icons/ic_call.svg'}
                            sx={{width: '15px', height: '15px', mr: 1}}
                        />
                        {staffNumberPhone}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell align="center" variant="subtitle2">
                {departments?.departmentName}
            </TableCell>
            <TableCell align="center">
                <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={(staffStatus === 1 && 'success') || (staffStatus === 0 && 'error') || 'warning'}
                    sx={{textTransform: 'capitalize'}}
                >
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {staffStatus === 1 ? "Đang làm việc" : staffStatus === 2 ? "Nghỉ dài hạn không lương" : staffStatus === 3 ? "Nghỉ thai sản" : "Đã nghỉ"}
                </Label>
            </TableCell>
            <TableCell align="center">
                <Typography noWrap variant="body2" onClick={onViewRow}>
                    {positions?.positionName}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                        <>
                            {staffStatus === 2 ? (
                                <MenuItem
                                    onClick={() => {
                                        handleCloseMenu();
                                    }}
                                    sx={{color: 'success.main'}}
                                >
                                    <SvgIconStyle
                                        src={'/icons/DashBoard/Product/ic_like.svg'}
                                        sx={{width: '16px', height: '16px', marginRight: '10px'}}
                                    />
                                    Hoạt Động
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    onClick={() => {
                                        handleCloseMenu();
                                    }}
                                    sx={{color: 'error.main'}}
                                >
                                    <SvgIconStyle
                                        src={'/icons/DashBoard/Product/ic_dislike.svg'}
                                        sx={{width: '16px', height: '16px', marginRight: '10px'}}
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
                                    sx={{width: '16px', height: '16px', marginRight: '10px'}}
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
                                    sx={{width: '16px', height: '16px', marginRight: '10px'}}
                                />
                                Sửa thông tin
                            </MenuItem>
                            <MenuItem onClick={handleClickOpen}>
                                <SvgIconStyle
                                    src={'/icons/DashBoard/Product/ic_delete.svg'}
                                    sx={{width: '16px', height: '16px', marginRight: '10px'}}
                                />
                                Xóa nhân viên
                            </MenuItem>
                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle>{'Xóa nhân viên'}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        Bạn có chắc chắn xóa nhân viên này không ?
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
