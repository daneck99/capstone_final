import { Fragment, useCallback } from 'react';

import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';

import { CafeInfoView } from '~/types/mypage';

interface RecentlyProps {
  items: CafeInfoView[];
}

const Recently = ({ items }: RecentlyProps) => {
  const theme = useTheme();

  const handleClick = useCallback(() => {}, []);

  return (
    <List sx={{ pt: 0 }}>
      {items.map((v) => (
        <Fragment key={v.cafeName}>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton sx={{ p: 2 }} onClick={handleClick}>
              <ListItemText>
                <Typography variant="h5">{v.cafeName}</Typography>
                <Typography variant="subtitle2">{v.address}</Typography>
                <Typography variant="subtitle2" color={theme.palette.grey[500]}>
                  후기 {v.commentReviewCount}
                  {Number(v.commentReviewCount) > 999 && '+'}
                </Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default Recently;
