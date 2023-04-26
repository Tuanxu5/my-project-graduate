import PropTypes from 'prop-types';
// @mui
import { Box } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../components/skeleton';
//
import ShopProductCard from './ShopProductCard';

// ----------------------------------------------------------------------

ShopProductList.propTypes = {
  dataProduct: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default function ShopProductList({ dataProduct, loading }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {(loading ? [...Array(6)] : dataProduct).map((product, index) =>
        product ? <ShopProductCard key={index} product={product} /> : <SkeletonProductItem key={index} />
      )}
    </Box>
  );
}
