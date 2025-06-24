import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';

import { Typography, useTheme } from '@mui/material';

import Popup from '~/components/atom/popup';
import getCoffeeBean from '~/pages/api/member/getCoffeeBean';
import { ActionButton } from '~/types/popup';
import reviewFail from '../../../static/images/not-review-logo.png';
import reviewSuccess from '../../../static/images/review-logo.png';
import { ReviewCount } from './cafeResponsePopup.styled';

interface CafePopupProps {
    openPopup: boolean;
    actions: ActionButton[];
    closePopup: () => void;
    type: 'success' | 'fail';
}

const CafeResponsePopup = ({
                               openPopup,
                               actions,
                               closePopup,
                               type,
                           }: CafePopupProps) => {
    const theme = useTheme();
    const mainColor = theme.palette.primary.main;
    const coffeColor = theme.palette.grey[400];

    return (
        <Popup
            open={openPopup}
            content={
                <>
                    {type === 'success' ? (
                        <>
                            <Image src={reviewSuccess} alt="" width={130} height={200} />
                            <ReviewCount>
                                <Typography variant="body2">리뷰 등록 완료!</Typography>
                            </ReviewCount>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2">리뷰 등록 실패!</Typography>
                        </>
                    )}
                </>
            }
            actions={actions}
            onClose={closePopup}
        />
    );
};
export default CafeResponsePopup;