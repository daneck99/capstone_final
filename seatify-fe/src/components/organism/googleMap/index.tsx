import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setCafeId } from '~/store/reducers/cafeIdSlice';
import { RootState } from '~/store';
import {
  setInitialized,
  selectIsMapInitialized,
} from '~/store/reducers/mapSlice';
import queryClient from '~/helpers/queryClient';
import { setNavigationContent } from '~/store/reducers/navigateSlice';
import { fetchSeats } from '~/pages/api/seat/getSeats';
import { tagSvgRaw } from './tagSvgRaw';
import { encodeSVG } from './encodeSVG';

const GoogleMapComponent = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(
    (state: RootState) => state.auth.auth.access_token
  );
  const isMapInitialized = useSelector(selectIsMapInitialized);

  const currentViewingCafeRef = useRef<string | null>(null);
  const markersRef = useRef<{ [cafeId: string]: google.maps.Marker }>({});
  const [viewerCount, setViewerCount] = useState<number | null>(null);

  const fetchCafesFromDB = async (token: string) => {
    const res = await fetch('http://localhost:8080/api/cafes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('DB에서 카페 정보 불러오기 실패');
    return res.json();
  };

  const loadGoogleMapScript = () =>
    new Promise<void>((resolve, reject) => {
      if (window.google && window.google.maps) return resolve();
      const existingScript = document.querySelector(
        `script[src^="https://maps.googleapis.com/maps/api/js"]`
      );
      if (existingScript)
        return existingScript.addEventListener('load', () => resolve());

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps failed to load.'));
      document.body.appendChild(script);
    });

  const sendTokenToFlask = async () => {
    try {
      await fetch('http://localhost:5001/set-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });
      console.log('✅ Flask 서버에 accessToken 전달 완료');
    } catch (err) {
      console.error('⛔ Flask 서버 전달 실패:', err);
    }
  };

  const refreshCafeMarkers = async () => {
    try {
      const cafes = await fetchCafesFromDB(accessToken);

      for (const cafe of cafes) {
        const seats = await fetchSeats(cafe.cafeId, accessToken);

        let seatCongestion: '1' | '2' | '3' | 'unknown';
        if (seats.length > 0) {
          const occupied = seats.filter((s) => s.occupied).length;
          const ratio = occupied / seats.length;
          seatCongestion = ratio <= 0.3 ? '1' : ratio <= 0.7 ? '2' : '3';
        } else seatCongestion = 'unknown';

        // ✅ unknown에 대응할 수 있도록 tagSvgRaw가 안전하게 처리하도록 수정돼 있어야 함
        const newSvg = tagSvgRaw(cafe.name, seatCongestion);
        const marker = markersRef.current[cafe.cafeId];
        if (marker) {
          marker.setIcon({
            url: encodeSVG(newSvg),
            scaledSize: new window.google.maps.Size(181, 65),
          });
        }
      }
    } catch (err) {
      console.error('❗ refreshCafeMarkers 실패:', err);
    }
  };

  const fetchNearbyCafes = async (lat: number, lng: number) => {
    const res = await fetch(`/api/cafe/cafes?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error('Failed to fetch nearby cafes');
    const data = await res.json();
    return data.results || [];
  };

  const saveCafesToDB = async (token: string, cafes: any[]) => {
    const res = await fetch('http://localhost:8080/api/cafes', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cafes),
    });

    console.log('🔥 payload:', JSON.stringify(cafes));

    if (!res.ok) throw new Error('Spring API DB 저장 실패');
  };

  const fetchPlaceDetails = async (placeId: string) => {
    // @ts-ignore
    const { Place } = (await google.maps.importLibrary(
      'places'
    )) as google.maps.PlacesLibrary;
    const place = new Place({ id: placeId, requestedLanguage: 'ko' });
    await place.fetchFields({
      fields: [
        'id',
        'displayName',
        'formattedAddress',
        'location',
        'nationalPhoneNumber',
        'businessStatus',
        'regularOpeningHours',
        'reviews',
        'rating',
      ],
    });


    return {
      placeId: place.id,
      name: place.displayName,
      latitude: place.location?.lat?.() || '',
      longitude: place.location?.lng?.() || '',
      address: place.formattedAddress || '',
      phoneNumber: place.nationalPhoneNumber || '',
      status: place.businessStatus || '',
      openingHours: JSON.stringify(place.regularOpeningHours) || '',
      reviews: JSON.stringify(place.reviews || []),
      rating: place.rating?.toString() || '',
    };
  };

  useEffect(() => {
    const unload = () => {
      localStorage.removeItem('map_initialized');
    };
    window.addEventListener('unload', unload);

    const mapInitFlag = localStorage.getItem('map_initialized') === 'true';
    if (!accessToken || isMapInitialized || mapInitFlag) return;

    const initMap = async () => {
      const map = new window.google.maps.Map(document.getElementById('map')!, {
        center: { lat: 37.504992, lng: 126.953561 },
        zoom: 18,
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });
      map.setOptions({ zoomControl: true });

      const hasSaved = localStorage.getItem('cafes_saved') === 'true';
      const firstSearch = { lat: 37.504992, lng: 126.953561 };
      const secondSearch = { lat: 37.507416, lng: 126.960169 };

      if (!hasSaved) {
        const firstNearby = await fetchNearbyCafes(
          firstSearch.lat,
          firstSearch.lng
        );
        const secondNearby = await fetchNearbyCafes(
          secondSearch.lat,
          secondSearch.lng
        );
        const detailedList = [
          ...(await Promise.all(
            firstNearby.map((p: any) => fetchPlaceDetails(p.place_id))
          )),
          ...(await Promise.all(
            secondNearby.map((p: any) => fetchPlaceDetails(p.place_id))
          )),
        ];

        try {
          await saveCafesToDB(accessToken, detailedList);
          queryClient.invalidateQueries(['cafeList']);
          localStorage.setItem('cafes_saved', 'true');
        } catch (e) {
          console.error('❌ saveCafesToDB 실패:', e);
        }
      }

      const cafes = await fetchCafesFromDB(accessToken);
      for (const cafe of cafes) {
        const position = {
          lat: parseFloat(cafe.latitude),
          lng: parseFloat(cafe.longitude),
        };
        const seats = await fetchSeats(cafe.cafeId, accessToken);
        const occupied = seats.filter((s) => s.occupied).length;
        const ratio = seats.length > 0 ? occupied / seats.length : 0;
        const seatCongestion = ratio <= 0.3 ? '1' : ratio <= 0.7 ? '2' : '3';
        const svg = tagSvgRaw(cafe.name, seatCongestion);

        const marker = new window.google.maps.Marker({
          position,
          map,
          icon: {
            url: encodeSVG(svg),
            scaledSize: new window.google.maps.Size(181, 65),
          },
        });

        markersRef.current[cafe.cafeId] = marker;

        marker.addListener('click', async () => {
          const prevId = currentViewingCafeRef.current;
          const newId = cafe.cafeId;

          if (prevId && prevId !== newId) {
            await fetch(
              `http://localhost:8080/api/cafe-view/end?cafe_id=${prevId}`,
              {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          }

          await fetch(
            `http://localhost:8080/api/cafe-view/start?cafe_id=${newId}`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );

          try {
            const res = await fetch(
              `http://localhost:8080/api/cafe-view/count?cafe_id=${newId}`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            const count = await res.json();
            setViewerCount(count);
          } catch {
            console.warn('실시간 시청자 수 가져오기 실패');
            setViewerCount(null);
          }

          currentViewingCafeRef.current = newId;
          dispatch(setCafeId({ cafeId: newId, commentId: '0' }));
          dispatch(setNavigationContent('content'));
        });
      }

      sendTokenToFlask();
      console.log('🎯 불러온 카페 목록:', cafes);
      dispatch(setInitialized());
      localStorage.setItem('map_initialized', 'true');
      return () => window.removeEventListener('unload', unload);
    };

    loadGoogleMapScript()
      .then(() => initMap())
      .catch((err) => console.error('Google Maps API load error:', err));
  }, [dispatch, accessToken, isMapInitialized]);

  // ✅ 별도 주기적 마커 갱신 useEffect
  useEffect(() => {
    if (!accessToken) return;
    const interval = setInterval(() => {
      refreshCafeMarkers(); // ✅ 여기
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const forceRefreshCafes = async () => {
    const firstSearch = { lat: 37.504992, lng: 126.953561 };
    const secondSearch = { lat: 37.507416, lng: 126.960169 };
    const firstNearby = await fetchNearbyCafes(
      firstSearch.lat,
      firstSearch.lng
    );
    const secondNearby = await fetchNearbyCafes(
      secondSearch.lat,
      secondSearch.lng
    );
    const detailedList = [
      ...(await Promise.all(
        firstNearby.map((p: any) => fetchPlaceDetails(p.place_id))
      )),
      ...(await Promise.all(
        secondNearby.map((p: any) => fetchPlaceDetails(p.place_id))
      )),
    ];

    try {
      console.log('📡 Google API로 카페 새로 요청 중...');
      await saveCafesToDB(accessToken, detailedList);
      console.log('✅ DB 저장 완료');
      queryClient.invalidateQueries(['cafeList']);
      localStorage.setItem('cafes_saved', 'true');
    } catch (e) {
      console.error('❌ saveCafesToDB 실패:', e);
    }
  };

  return (
      <>
        <div id="map" style={{width: '100%', height: '100vh'}}/>
        <button
            onClick={() => {
              console.log('버튼 눌림');
              forceRefreshCafes();
            }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1000,
              background: '#333',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer', // ✅ 마우스 올렸을 때 포인터로 변경
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#555'; // ✅ hover 시 색상 변경
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#333'; // ✅ 원래 색상으로 복원
            }}
        >
          🔄 Google API로 카페 새로 불러오기
        </button>
      </>
  );
};

export default GoogleMapComponent;
