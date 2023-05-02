import PropTypes from 'prop-types';
import {Stack, InputAdornment, TextField, MenuItem} from '@mui/material';
import {alpha, styled} from '@mui/material/styles';
import DatePicker from "@mui/lab/DatePicker";


// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 180;

TimeSheetsTableToolbar.propTypes = {
    filterName: PropTypes.string,
    filterStatus: PropTypes.string,
    onFilterName: PropTypes.func,
    onFilterStatus: PropTypes.func,
    optionsService: PropTypes.object.isRequired,
};

const IconStyle = styled('div')(({theme}) => ({
    marginLeft: -4,
    borderRadius: '50%',
    width: theme.spacing(2),
    height: theme.spacing(2),
    border: `solid 2px ${theme.palette.background.paper}`,
    boxShadow: `inset -1px 1px 2px ${alpha(theme.palette.common.black, 0.24)}`,
}));

export default function TimeSheetsTableToolbar({
                                                   optionsService,
                                                   filterName,
                                                   filterStatus,
                                                   onFilterName,
                                                   onFilterStatus,
                                                   optionStatusType,
                                                   onFilterDepartments,
                                                   filterDepartments, handleDateChange, selectedDate
                                               }) {
    return (
        <div>
            <Stack spacing={2} direction={{xs: 'column', md: 'row'}} sx={{pt: 2.5, pb: 2.5, px: 3}}>
                <TextField
                    className="text-[14px]"
                    fullWidth
                    select
                    label="Trạng Thái123123"
                    value={filterStatus}
                    onChange={onFilterStatus}
                    SelectProps={{
                        MenuProps: {
                            sx: {'& .MuiPaper-root': {maxHeight: 260}},
                        },
                    }}
                    sx={{
                        maxWidth: {md: INPUT_WIDTH},
                        textTransform: 'capitalize',
                    }}
                >
                    {optionsService?.map((option) => (
                        <MenuItem
                            key={option?.label}
                            value={option?.value}
                            sx={{
                                mx: 1,
                                my: 0.5,
                                borderRadius: 0.75,
                                typography: 'body2',
                                textTransform: 'capitalize',
                            }}
                        >
                            {option?.label}
                        </MenuItem>
                    ))}
                </TextField>
                <DatePicker
                    label="Ngày Bắt Đầu"
                    value={selectedDate}
                    onChange={handleDateChange}
                    views={['year', 'month']}
                    disableToolbar
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            sx={{
                                maxWidth: {md: INPUT_WIDTH},
                            }}
                        />
                    )}
                />
                <TextField
                    fullWidth
                    value={filterName}
                    onChange={(event) => onFilterName(event.target.value)}
                    placeholder="Tìm kiếm tên nhân viên, mã nhân viên..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Iconify icon={'eva:search-fill'} sx={{color: 'text.disabled', width: 20, height: 20}}/>
                            </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Stack spacing={2} direction={{md: 'row'}}
                   sx={{pb: 2.5, px: 3, fontSize: 13, display: "flex", alignItems: "center", gap: 5}}>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <IconStyle sx={{bgcolor: "#00AB55"}}/>
                    <span>Chấm công đúng giờ</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <IconStyle sx={{bgcolor: "#fda92d"}}/>
                    <span>Đi muộn / Về sớm / Quên Check out</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <IconStyle sx={{bgcolor: "#919EAB"}}/>
                    <span>Không chấm công</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <IconStyle sx={{bgcolor: "#2065D1"}}/>
                    <span>Có đơn từ</span>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                    <IconStyle sx={{bgcolor: "#FF3030"}}/>
                    <span>Nghỉ lễ</span>
                </div>
            </Stack>
        </div>
    );
}
