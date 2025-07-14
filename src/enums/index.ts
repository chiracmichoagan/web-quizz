const ScreenComponents = {
  Welcom: 'Welcom',
  Options: 'Options',
  Quiz: 'Quiz',
  Report: 'Report',
} as const;

type ScreenComponents = (typeof ScreenComponents)[keyof typeof ScreenComponents];

const ResponseCodes = {
  NoResult: 1,
} as const;

type ResponseCodes = (typeof ResponseCodes)[keyof typeof ResponseCodes];

export { ScreenComponents, ResponseCodes };
