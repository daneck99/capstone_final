import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  /// / v5 useQuery사용할 때 onError, onSuccess 사용 x => QueryClient를 세팅할 때 전역 캐시 단계에서 콜백을 사용
  // queryCache: new QueryCache({
  //  onError: (error, query) => {
  //    if (query.meta) {
  //      if (query.meta.errorMessage) {
  //        // console.log(query.meta.errorMessage);
  //      }
  //    }
  //  },
  // }),
  /// / => useQuery를 사용할 때 (onSuccess, onError 사용 x)
  /// / meta: {
  /// /  errorMessage: 'Failed to fetch todos',
  /// /  },
  /// / 이런식으로 query 마다 다른 에러 메시지 전달
  defaultOptions: {
    queries: {
      // staleTime을 변경하여 리엑트 쿼리에개 캐시된 데이터를 얼마나 자주 최신화 시켜줘야 하는지 알려줄 수 있다.(중복 호출 방지)
      // 5분으로 설정
      staleTime: 1000 * 300,
      retry: 0,
      // API가 실패하면 설정한 값만큼 재시도 하는 옵션
      suspense: true,
      useErrorBoundary: true,
    },
    // 예기치 못한 에러 케이스가 생길 수 있기에 queries와 mutations에 true 값으로 설정
    mutations: {
      useErrorBoundary: true,
    },
  },
});
export default queryClient;
