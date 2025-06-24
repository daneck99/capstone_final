// pages/api/cafes.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

// eslint-disable-next-line consistent-return
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat, lng 필수' });
  }

  try {
    // 1. nearbySearch
    const nearbyRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=300&type=cafe&language=ko&key=${GOOGLE_API_KEY}`
    );
    const nearbyData = await nearbyRes.json();

    if (nearbyData.status !== 'OK') {
      return res.status(500).json({
        message: 'NearbySearch 실패',
        error: nearbyData.error_message,
      });
    }

    const placeIds = nearbyData.results.map((place: any) => place.place_id);

    // 2. details API 병렬 호출
    const detailResults = await Promise.all(
      placeIds.map(async (placeId: string) => {
        try {
          const detailRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=place_id,name,formatted_address,formatted_phone_number,geometry,business_status,opening_hours&language=ko&key=${GOOGLE_API_KEY}`
          );
          const detailData = await detailRes.json();
          return detailData.result;
        } catch (err) {
          console.error('❌ detail fetch 실패:', err);
          return null;
        }
      })
    );

    const validCafes = detailResults.filter(Boolean); // null 제거

    res.status(200).json({ results: validCafes });
  } catch (err) {
    console.error('Google API 전체 요청 실패:', err);
    res.status(500).json({ message: 'Google API 전체 요청 실패' });
  }
}
