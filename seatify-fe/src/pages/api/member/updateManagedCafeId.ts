import axios from 'axios';

export const updateManagedCafeId = async (managedCafeId: string, accessToken: string) => {
    try {
        const res = await axios.patch(
            'http://localhost:8080/api/member/managed-cafe',
            { managedCafeId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return res.data;
    } catch (error) {
        console.error('❌ managedCafeId 업데이트 실패:', error);
        throw error;
    }
};
