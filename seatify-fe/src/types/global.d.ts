/* eslint-disable @typescript-eslint/no-explicit-any */

 

// 컴파일러는 export/import 구문이 없는 파일은 스크립트로 인지
// 스크립트가 존재하는 스코프에 속하기 때문에 다른 모듈은 이 타입을 인지할 수 없다
// 가짜 export를 넣어서 외부 모듈로 인식해 컴파일러가 이 파일을 모듈로 처리
export {};

declare global {
  interface Window {
    Kakao: any; // window 객체에 kakao 속성을 추가
    google: any; // window 객체에 google 속성을 추가
    initMap: () => void;
  }
}
