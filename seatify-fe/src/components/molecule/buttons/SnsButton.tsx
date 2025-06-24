 

import { GoogleButton, KakaoButton } from '~/components/atom/buttons';

interface ButtonProps {
  onClick: () => void;
  type: 'kakao' | 'google';
}
const SnsButton = ({ onClick, type }: ButtonProps) => {
  if (type === 'kakao') {
    return <KakaoButton onClick={onClick} />;
  }
  if (type === 'google') {
    return <GoogleButton onClick={onClick} />;
  }
  return null;
};
export default SnsButton;
