interface ErrorProps {
  error: any;
}

const ErrorFallback = ({ error }: ErrorProps) => {
  if (error && error.errorCode === 'A-001') {
    return <div>Access token을 재발급 중입니다...</div>;
  }
  return <div>오류</div>;
};
export default ErrorFallback;
