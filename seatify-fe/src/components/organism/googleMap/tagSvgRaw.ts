 

import {
  greenRadio,
  orangeRadio,
  redRadio,
  unknownRadio,
} from '~/static/svg/RadioButton';

export const tagSvgRaw = (text: string, status: string) => {
  // text 길이에 따라 동적으로 width 변환
  const textWidth = text.length * 7 + 32;
  const textX = textWidth / 2 + 10;

  let svgContent;
  if (status === '1') {
    svgContent = greenRadio;
  } else if (status === '2') {
    svgContent = orangeRadio;
  } else if (status === '3') {
    svgContent = redRadio;
  } else {
    svgContent = unknownRadio;
  }

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="45" viewBox="0 0 ${textWidth} 45" fill="none">

    <rect x="0" y="10" width="${textWidth}" height="25" rx="5" fill="white" stroke="gray" stroke-width="1"/>
    
    ${svgContent}
    
    <text x="${textX}" y="26"
          text-anchor="middle" fill="black"
          font-size="8px" font-family="sans-serif" font-weight="bold" >
          ${text}
    </text>
  </svg>
`;
};
