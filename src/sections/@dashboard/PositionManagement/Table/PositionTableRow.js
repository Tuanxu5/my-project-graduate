import * as React from 'react';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';
// @mui
import {useTheme} from '@mui/material/styles';
import {Checkbox, TableRow, TableCell, Typography, MenuItem} from '@mui/material';
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
import {TableMoreMenu} from '../../../../components/table';
// icon
import SvgIconStyle from '../../../../components/SvgIconStyle';
import {getDepartmentsAPI} from "../../../../Api/ApiDepartments";
// ----------------------------------------------------------------------

PositionTableRow.propTypes = {
    row: PropTypes.object,
    selected: PropTypes.bool,
    onEditRow: PropTypes.func,
    onSelectRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function PositionTableRow({row, selected, onEditRow, onSelectRow, onDeleteRow}) {
    const theme = useTheme();

    const {positionName, positionCreatedAt, positionStatus, departmentId} = row;

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
    const [dataDepartments, setDataDepartments] = useState([]);
    useEffect(() => {
        const fetchDataDepartments = async () => {
            setDataDepartments(await getDepartmentsAPI());
        };
        fetchDataDepartments();
    }, []);


    const departments = dataDepartments.find((department) => department?.id === Number(departmentId));
    const getDateTime = new Date(positionCreatedAt);
    const getDays = getDateTime.getDate();
    const getMonths = getDateTime.getMonth();
    const getYears = getDateTime.getFullYear();
    const getFormatDay = `${getDays} Tháng ${getMonths + 1}, ${getYears}`;
    return (
        <TableRow hover selected={selected}>
            <TableCell padding="checkbox">
                <Checkbox checked={selected} onClick={onSelectRow}/>
            </TableCell>
            <TableCell align="center">
                <Typography variant="subtitle2" noWrap>
                    {positionName}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography variant="subtitle2" noWrap>
                    {departments?.departmentName}
                </Typography>
            </TableCell>
            <TableCell align="center">{getFormatDay}</TableCell>
            <TableCell align="center">
                <Label
                    variant={theme?.palette?.mode === 'light' ? 'ghost' : 'filled'}
                    color={(positionStatus === 1 && 'success') || 'error'}
                    sx={{textTransform: 'capitalize'}}
                >
                    {positionStatus === 1 ? 'Hoạt Động' : 'Tạm Ẩn'}
                </Label>
            </TableCell>

            <TableCell align="right">
                <TableMoreMenu
                    open={openMenu}
                    onOpen={handleOpenMenu}
                    onClose={handleCloseMenu}
                    actions={
                        <>
                            {positionStatus === 2 ? (
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
                                    sx={{width: '16px', height: '16px', marginRight: '10px'}}
                                />
                                Sửa chức vụ
                            </MenuItem>
                            <MenuItem onClick={handleClickOpen}>
                                <SvgIconStyle
                                    src={'/icons/DashBoard/Product/ic_delete.svg'}
                                    sx={{width: '16px', height: '16px', marginRight: '10px'}}
                                />
                                Xóa chức vụ
                            </MenuItem>
                            <Dialog
                                open={open}
                                TransitionComponent={Transition}
                                keepMounted
                                onClose={handleClose}
                                aria-describedby="alert-dialog-slide-description"
                            >
                                <DialogTitle>{'Xóa Phòng Ban'}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description">
                                        Bạn có chắc chắn muốn xoá chức vụ này không ?
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
