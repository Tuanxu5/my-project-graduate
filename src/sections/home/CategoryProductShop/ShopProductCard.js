import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Box, Card, Link, Typography, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../routes/paths';
// utils
import { fCurrency } from '../../../utils/formatNumber';
// components
import Label from '../../../components/Label';
import Image from '../../../components/Image';
import { ColorPreview } from '../../../components/color-utils';

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object,
};

export default function ShopProductCard({ product }) {
  const { productCode, productName, productImage, productPrice, productStatus } = product;
  const colors = ['#fff', '#000'];

  const linkTo = PATH_PAGE.productDetails(productCode);
  console.log(linkTo);
  return (
    <Card>
      <Box sx={{ position: 'relative', p: '10px' }}>
        {productStatus && (
          <Label
            variant="filled"
            // color={(productStatus === 'sale' && 'error') || 'info'}
            color="error"
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {/* {productStatus} */}Sale
          </Label>
        )}
        <Image
          alt={productName}
          src={productImage}
          ratio="1/1"
          sx={{
            borderRadius: '12px',
          }}
        />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {productName}
          </Typography>
        </Link>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <ColorPreview colors={colors} />

          <Stack direction="row" spacing={0.5}>
            {productPrice && (
              <Typography component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
                {fCurrency(productPrice)}
              </Typography>
            )}

            <Typography variant="subtitle1">{fCurrency(productPrice)}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
