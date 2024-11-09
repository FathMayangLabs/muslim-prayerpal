import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const ArrowIcon = (props: SvgProps) => (
  <Svg
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit={2}
    clipRule="evenodd"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M16.843 13.789A.75.75 0 0 1 16.251 15H7.75a.75.75 0 0 1-.591-1.212l4.258-5.498a.746.746 0 0 1 1.183.001l4.243 5.498z" />
  </Svg>
);
export default ArrowIcon;
