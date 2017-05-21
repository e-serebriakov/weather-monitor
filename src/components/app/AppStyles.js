import PTSans from '../../common/static/fonts/PTSans/PTC55F_W.ttf';

export function resetStyles() {
  return `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    html {
      min-height: 100%;
    }
  `;
}

export function styleGlobally() {
  return `
    @font-face {
      font-family: PTSans;
      src: url('${PTSans}') format('truetype');
    }
    
    body {
      font-family: PTSans;
      font-size: 16px;
      background: #34e89e;
      background: linear-gradient(-45deg, #0f3443, #34e89e);
      background-size: cover;
    }
  `;
}
