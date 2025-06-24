
const nextConfig = {
  reactStrictMode: false,

  // 코드 경량화 작업
  swcMinify: true,
  compiler: {
    // ssr, displayName true가 기본값으로 켜진다.
    styledComponents: true,
  },
};

module.exports = nextConfig;
