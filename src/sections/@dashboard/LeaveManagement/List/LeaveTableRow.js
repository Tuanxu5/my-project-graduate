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
import LeaveTableToolbar from "./LeaveTableToolbar";

// ----------------------------------------------------------------------

LeaveTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function LeaveTableRow({
                                          row,
                                          selected,
                                          onSelectRow,
                                          onViewRow,
                                          onEditRow,
                                          onDeleteRow,
                                          dataStaff, dataPosition
                                      }) {
    const theme = useTheme();

    const {
        staffId,
        leaveAll,
        leaveUse,
        leaveExpri,
        leaveAllOld,
        leaveUseOld,
        leaveExpriOld
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

    // const positions = dataPosition.find((position) => position.id === positionId);
    // const departments = dataDepartments.find((department) => department.id === departmentId);
    console.log(row)
    const staffs = dataStaff?.find((staff) => staff?.staffCode === staffId);
    return (
        <TableRow hover selected={selected} stickyHeader aria-label="sticky table">
            <TableCell align="center">
                <Typography variant="subtitle2" noWrap>
                    {staffId}
                </Typography>
            </TableCell>
            <TableCell align="left">
                <Typography variant="subtitle2" noWrap>
                    {staffs?.staffName}
                </Typography>
            </TableCell>
            <TableCell align="center" variant="subtitle2"
                       style={{fontWeight: 700, color: "#00AB55", background: "rgba(84, 214, 44, 0.16)"}}>
                {leaveAll}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#637381", background: "rgba(145, 158, 171, 0.16)"}}>
                {leaveUse}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#B72136", background: "rgba(255, 72, 66, 0.16)"}}>
                {leaveExpri}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#0C53B7", background: "rgba(24, 144, 255, 0.16)"}}>
                {leaveAll - leaveUse - leaveExpri}
            </TableCell>
            <TableCell align="center" variant="subtitle2"
                       style={{fontWeight: 700, color: "#00AB55", background: "rgba(84, 214, 44, 0.16)"}}>
                {leaveAllOld}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#637381", background: "rgba(145, 158, 171, 0.16)"}}>
                {leaveUseOld}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#B72136", background: "rgba(255, 72, 66, 0.16)"}}>
                {leaveExpriOld}
            </TableCell>
            <TableCell align="center"
                       style={{fontWeight: 700, color: "#0C53B7", background: "rgba(24, 144, 255, 0.16)"}}>
                {leaveAllOld - leaveUseOld - leaveExpriOld}
            </TableCell>
        </TableRow>
    );
}
