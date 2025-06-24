import { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';

import {
  Typography,
  InputBase,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import {
  setNavigationContent,
  useNavigationSelector,
} from '~/store/reducers/navigateSlice';
import { CafeInfo } from '~/types/cafeInfo'; // ✅ CafeInfo 로 변경
import {
  StyledArrowIcon,
  StyledBox,
  StyledInput,
  StyledSearchBox,
  StyledWrapper,
} from './search.styled';

interface SearchCafeProp {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  filterCafe: CafeInfo[]; // ✅ CafeInfo[] 로 수정
}

const SearchCafe = ({
                      searchInput,
                      setSearchInput,
                      filterCafe,
                    }: SearchCafeProp) => {
  const dispatch = useDispatch();
  const navigate = useNavigationSelector();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  const handleSearchCancel = () => {
    setSearchInput('');
  };

  const handleCafeListClick = (cafe: CafeInfo) => {
    setSearchInput(cafe.name);
  };

  const handleSearchCafeClick = () => {
    if (searchInput === '') return;
    dispatch(setNavigationContent('search-list'));
  };

  return (
    <StyledWrapper>
      <StyledInput>

      {navigate === 'search' &&
        searchInput !== '' &&
        filterCafe?.length > 0 && (
          <StyledSearchBox>
            {filterCafe.map((cafe) => (
              <Typography
                key={cafe.cafeId}
                mt="10px"
                onClick={() => handleCafeListClick(cafe)}
              >
                {cafe.name.toLowerCase().includes(searchInput.toLowerCase()) ? (
                  <span>
                    {cafe.name
                      .split(new RegExp(`(${searchInput})`, 'ig'))
                      .map((part, idx) =>
                        part.toLowerCase() === searchInput.toLowerCase() ? (
                          <span key={idx} style={{ color: 'orange' }}>
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                  </span>
                ) : (
                  cafe.name
                )}
              </Typography>
            ))}
          </StyledSearchBox>
        )}

      {navigate === 'search' && searchInput === '' && (
        <StyledSearchBox>
          <Typography mt="10px">검색어를 입력해주세요</Typography>
        </StyledSearchBox>
      )}

      {navigate === 'search' &&
        searchInput !== '' &&
        filterCafe?.length === 0 && (
          <StyledSearchBox>
            <Typography mt="10px">검색 결과가 없습니다</Typography>
          </StyledSearchBox>
        )}
    </StyledWrapper>
  );
};

export default SearchCafe;
