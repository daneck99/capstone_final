import Image from 'next/image';

import { Typography } from '@mui/material';

import searchLogo from '../../../static/images/not-search-logo.png';
import { SearchContainer } from './cafeInfo.styled';

interface NoCafeProp {
  searchInput: string;
}
const NoCafeComment = ({ searchInput }: NoCafeProp) => {
  return (
    <SearchContainer>
      <Image src={searchLogo} alt="" />
      <Typography variant="h5" mt="20px">
        {searchInput} 와 일치하는 카페 검색결과가 없습니다.
      </Typography>
    </SearchContainer>
  );
};
export default NoCafeComment;
