import {scale} from "react-native-size-matters";

const typography = {
    letterSpacings: {
      xs: '-0.05em',
      sm: '-0.025em',
      md: 0,
      lg: '0.025em',
      xl: '0.05em',
      '2xl': '0.1em',
    },
    lineHeights: {
      '2xs': '1em',
      xs: '1.125em',
      sm: '1.25em',
      md: '1.375em',
      lg: '1.5em',
      xl: '1.75em',
      '2xl': '2em',
      '3xl': '2.5em',
      '4xl': '3em',
      '5xl': '4em',
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
      extrablack: 950,
    },
    fonts: {
      heading: undefined,
      body: undefined,
      mono: undefined,
    },
    fontSizes: {
      '2xs': scale(10),
      xs: scale(12),
      sm: scale(14),
      md: scale(16),
      lg: scale(18),
      xl: scale(20),
      '2xl': scale(24),
      '3xl': scale(30),
      '4xl': scale(36),
      '5xl': scale(48),
      '6xl': scale(60),
      '7xl': scale(72),
      '8xl': scale(96),
      '9xl': scale(128),
    },
  };

export default typography;