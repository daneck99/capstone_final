import { QueryClient, dehydrate } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import Cookies from 'universal-cookie';
import { serialize } from 'cookie';

import { Box } from '@mui/material';

import { setToken } from '~/store/reducers/authSlice';
// Google Maps 페이지
import wrapper from '~/store';
import GoogleMapComponent from '~/components/organism/googleMap';
import { setCookie } from '~/helpers/cookie';
import { getAccessToken } from './api/user';
import getAllCafeInfo from './api/home/getAllCafeInfo';

const Home = () => {
    return (
        <Box>
            <GoogleMapComponent />
        </Box>
    );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(
    (store) => async (context: GetServerSidePropsContext) => {
        const { req, res } = context;

        const cookies = new Cookies(req.headers.cookie);
        const refreshToken = cookies.get('refreshToken');

        const queryClient = new QueryClient();

        const accessTokenResponse = await queryClient.fetchQuery(
            ['accessToken'],
            () => getAccessToken(refreshToken)
        );

        const { accessToken } = accessTokenResponse;

        if (accessToken) {
            // Redux 저장
            store.dispatch(setToken({ access_token: accessToken }));

            // ✅ 응답 헤더에 직접 Set-Cookie 추가
            const cookieStr = serialize('accessToken', accessToken, {
                path: '/',
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60, // 1시간
                sameSite: 'lax',
            });
            res.setHeader('Set-Cookie', cookieStr);
        }

        // 사전 카페 데이터
        await queryClient.prefetchQuery(['cafeList'], () => getAllCafeInfo(accessToken));

        return {
            props: {
                dehydratedProps: dehydrate(queryClient),
            },
        };
    }
);