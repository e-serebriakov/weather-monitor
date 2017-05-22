import { keyframes } from 'styled-components';

const addBtnShake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  1% { transform: translate(-1px, -1px) rotate(-1deg); }
  2% { transform: translate(-1px, 0px) rotate(1deg); }
  3% { transform: translate(0px, 1px) rotate(0deg); }
  4% { transform: translate(1px, -1px) rotate(1deg); }
  5% { transform: translate(0, 0) rotate(0); }
  6% { transform: translate(-1px, -1px) rotate(-1deg); }
  7% { transform: translate(-1px, 0px) rotate(1deg); }
  8% { transform: translate(0px, 1px) rotate(0deg); }
  9% { transform: translate(1px, -1px) rotate(1deg); }
  10% { transform: translate(0, 0) rotate(0); }
`;

export {
  addBtnShake,
};
