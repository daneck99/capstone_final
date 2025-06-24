import { Typography } from '@mui/material';
import { Header } from '~/components/atom/header';
import { SettingBox } from './mypageSetting.styled';

const MypageSetting = () => {
  return (
    <>
      <Header name="설정" />
      <SettingBox>
        <Typography mb="28px">서비스 설명</Typography>
        <Typography mb="28px">약관</Typography>
        <Typography>로그아웃</Typography>
      </SettingBox>
    </>
  );
};
export default MypageSetting;
