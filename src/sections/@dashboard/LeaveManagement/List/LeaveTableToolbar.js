import PropTypes from 'prop-types';
import {Stack, InputAdornment, TextField, MenuItem} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const INPUT_WIDTH = 180;

LeaveTableToolbar.propTypes = {
    filterName: PropTypes.string,
    filterStatus: PropTypes.string,
    onFilterName: PropTypes.func,
    onFilterStatus: PropTypes.func,
    optionsService: PropTypes.object.isRequired,
};

export default function LeaveTableToolbar({
                                              optionsService,
                                              filterName,
                                              filterStatus,
                                              onFilterName,
                                              onFilterStatus,
                                              optionStatusType,
                                              onFilterDepartments,
                                              filterDepartments
                                          }) {
    return (
        <Stack spacing={2} direction={{xs: 'column', md: 'row'}} sx={{py: 2.5, px: 3}}>
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
    );
}
