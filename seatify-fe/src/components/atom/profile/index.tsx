 
import DefaultProfile from '~/static/images/profile.png';
import { BoxProps } from '@mui/material';
import { Background, ProfileImage } from './profile.styled';

type TSize = 'sm' | 'md' | 'lg';

interface MiniProfileProps extends BoxProps {
  src?: string;
  size: TSize;
}

const Profile = ({ src, size, ...props }: MiniProfileProps) => {
  return (
    <Background size={size} {...props}>
      <ProfileImage src={src || DefaultProfile} alt="프로필 이미지" />
    </Background>
  );
};

Profile.defaultProps = {
  src: '',
};

export default Profile;
