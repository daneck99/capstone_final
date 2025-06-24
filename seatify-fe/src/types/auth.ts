export interface KakaoResponse {
  access_token: string;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    accessTokenExpireTime: string;
    refreshTokenExpireTime: string;
    refreshToken: string;
    managedCafeId: string;
  };
}
