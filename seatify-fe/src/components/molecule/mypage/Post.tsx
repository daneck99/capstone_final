import { Fragment, useCallback } from 'react';

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { Review } from '~/types/mypage';
import { LabelItems } from '../label';
import RadioStatusButton from '../radioButtons/RadioStatusButton';

interface PostProps {
  items: Review[];
}

const Post = ({ items }: PostProps) => {
  const handleClick = useCallback(() => {}, []);

  return (
    <List sx={{ pt: 0 }}>
      {items.map((v) => (
        <Fragment key={v.address}>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton sx={{ p: 2 }} onClick={handleClick}>
              <ListItemText>
                <Typography variant="h5">{v.cafeName}</Typography>

                <Typography variant="subtitle2">{v.address}</Typography>
              </ListItemText>

              <Box my={2}>
                <RadioStatusButton status={v.cafeCongestion} />

                <LabelItems hasPlug={v.hasPlug} isClean={v.isClean} />
              </Box>
            </ListItemButton>
          </ListItem>
          <Divider />
        </Fragment>
      ))}
    </List>
  );
};

export default Post;
