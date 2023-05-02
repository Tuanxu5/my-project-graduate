/* eslint-disable global-require */
import * as React from 'react';
import PropTypes from 'prop-types';
import {useState, useEffect} from 'react';
import {format, getDay} from "date-fns";
import moment from "moment";


// @mui
import {alpha, styled, useTheme} from '@mui/material/styles';
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

TimeSheetsTableRow.propTypes = {
    row: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    onSelectRow: PropTypes.func,
    onViewRow: PropTypes.func,
    onEditRow: PropTypes.func,
    onDeleteRow: PropTypes.func,
};
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function TimeSheetsTableRow({
                                               row,
                                               selected,
                                               onSelectRow,
                                               onViewRow,
                                               onEditRow,
                                               onDeleteRow,
                                               dataDepartments,
                                               dataPosition,
                                               TABLE_HEAD,
                                               dataFiltered,
                                               days,
                                               dataTimesheets
                                           }) {
    const theme = useTheme();

    const {
        timekeepingId, staffId, timekeepingTimeOut, timesheet
    } = row;

    function hihi(date) {
        const dayOfWeek = getDay(date);
        return dayOfWeek === 0 || dayOfWeek === 6;
    }

    const IconStyle = styled('div')(({theme}) => ({
        margin: "0 auto",
        borderRadius: '50%',
        width: theme.spacing(2),
        height: theme.spacing(2),
        border: `solid 2px ${theme.palette.background.paper}`,
        boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
    }));

    return (
        <TableRow hover selected={selected} stickyHeader aria-label="sticky table">
            <TableCell align="center">
                <Link variant="subtitle2" noWrap sx={{ color: '#000', cursor: 'pointer' }}>
                    Lê Hoàng Tuấn
                </Link>
            </TableCell>

            {days.map((day) => {
                const attendanceRecord = timesheet.find(
                    (record) => format(day, 'yyyy-MM-dd') === record.timekeepingDate
                );
                const checkDiMuon = attendanceRecord && Number(attendanceRecord?.timekeepingEntryTime?.replace(':', '')) > 830;
                const checkVeSom = attendanceRecord && Number(attendanceRecord?.timekeepingTimeOut?.replace(':', '')) < 1730;
                const checkKhongchamcong = attendanceRecord && attendanceRecord?.timekeepingEntryTime?.length === 0;
                const checkchamcong = attendanceRecord && attendanceRecord?.timekeepingEntryTime?.length > 0;
                const isWeekend = hihi(day);
                let attendanceResult = '';
                if (isWeekend) {
                    attendanceResult = 'T7 CN';
                } else if (!attendanceRecord) {
                    attendanceResult = '';
                } else if (checkKhongchamcong) {
                    attendanceResult = <IconStyle sx={{
                        bgcolor: "#919EAB"
                    }}/>;
                } else if (checkDiMuon || checkVeSom) {
                    attendanceResult = <IconStyle sx={{
                        bgcolor: "#fda92d"
                    }}/>;
                } else {
                    attendanceResult = <IconStyle sx={{
                        bgcolor: "#00AB55"
                    }}/>;
                }

                return (
                    <TableCell align="center" style={{
                        fontSize: 11
                    }}>
                        <Typography variant="subtitle2" noWrap>
                            {attendanceResult}
                        </Typography>

                    </TableCell>
                );
            })

            }
        </TableRow>
    )
        ;
}
