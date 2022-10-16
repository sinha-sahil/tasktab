export type ButtonProperties = {
  text: string;
  enable: boolean;
  showLoader: boolean;
};

export const defaultButtonProperties: ButtonProperties = {
  text: 'click',
  enable: true,
  showLoader: false
};
