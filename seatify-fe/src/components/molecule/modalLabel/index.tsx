 

import { Typography, useTheme } from '@mui/material';
import { UnderlineButton } from '~/components/atom/buttons';
import Radio from '~/components/atom/radio';
import { ModalLabelContainer } from './modalLabel.styled';

interface ModalLabelProps {
  type?: 'content' | 'search';
  onClick: () => void;
}
const ModalLabel = ({ type, onClick }: ModalLabelProps) => {
  const theme = useTheme();
  const infoColor = theme.palette.grey[400];
  return (
    <ModalLabelContainer>
      {type === 'search' && <Radio status="0" />}
      {type === 'search' ? (
        <Typography variant="caption" color={infoColor} mt="8px">
          지금 사람이 많을까? 매장은 깨끗할까?
        </Typography>
      ) : (
        <Typography variant="caption" color={infoColor} mt="15px">
          실시간 혼잡도를 조회하면 추가 정보를 확인할 수 있어요!
        </Typography>
      )}

      <UnderlineButton text="지금 알아보기" onClick={onClick} />
    </ModalLabelContainer>
  );
};
export default ModalLabel;

ModalLabel.defaultProps = {
  type: 'content',
};
