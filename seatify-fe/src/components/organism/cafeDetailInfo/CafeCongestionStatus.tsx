import { useCallback } from 'react';
import { Box } from '@mui/material';

import {
    RadioStatusBoxButton,
    RadioStatusSearchButton,
} from '~/components/molecule/radioButtons';
import { useNavigationSelector } from '~/store/reducers/navigateSlice';
import { useCafeIdSelector } from '~/store/reducers/cafeIdSlice';

interface CongestionProps {
    congestion: string;
}

const CafeCongestionStatus = ({ congestion }: CongestionProps) => {
    const { cafeId } = useCafeIdSelector();
    const navigate = useNavigationSelector();

    // 혼잡도 버튼 클릭 핸들러
    const handleCongestionClick = useCallback(() => {
        console.log(`혼잡도 확인 클릭 - Cafe ID: ${cafeId}`);
        // 여기에 혼잡도 확인 관련 로직 추가 가능
    }, [cafeId]);

    return (
        <Box>
            {['0', '1', '2', '3'].includes(congestion) && (
                <>
                    {congestion === '0' && navigate === 'search-detail' ? (
                        <RadioStatusSearchButton
                            onClick={handleCongestionClick}
                        />
                    ) : (
                        <RadioStatusBoxButton
                            status={congestion}
                            onClick={handleCongestionClick}
                        />
                    )}
                </>
            )}
        </Box>
    );
};

export default CafeCongestionStatus;
