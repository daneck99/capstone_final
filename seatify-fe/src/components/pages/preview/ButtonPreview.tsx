 
import { useCallback } from 'react';

import { Box, Grid, Typography } from '@mui/material';

import { BoxButton, CapsuleButton } from '~/components/atom/buttons';

const ButtonPreview = () => {
  const handleClick = useCallback(() => {}, []);

  return (
    <Box sx={{ my: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Box Button</Typography>

          <BoxButton
            title="버튼"
            color="primary"
            padding="xl"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="primary"
            padding="lg"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="primary"
            padding="md"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="primary"
            padding="sm"
            onClick={handleClick}
          />
        </Grid>

        <Grid item xs={12}>
          <BoxButton
            title="버튼"
            color="secondary"
            padding="xl"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="secondary"
            padding="lg"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="secondary"
            padding="md"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            color="secondary"
            padding="sm"
            disabled
            onClick={handleClick}
          />
        </Grid>

        <Grid item xs={12}>
          <BoxButton
            title="버튼"
            variant="outlined"
            padding="xl"
            disabled
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            variant="outlined"
            padding="lg"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            variant="outlined"
            padding="md"
            onClick={handleClick}
          />
          <BoxButton
            title="버튼"
            variant="outlined"
            padding="sm"
            onClick={handleClick}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1">Capsule Button</Typography>

          <CapsuleButton title="버튼" padding="xl" onClick={handleClick} />
          <CapsuleButton title="버튼" padding="lg" onClick={handleClick} />
          <CapsuleButton title="버튼" padding="md" onClick={handleClick} />
          <CapsuleButton title="버튼" padding="sm" onClick={handleClick} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ButtonPreview;
