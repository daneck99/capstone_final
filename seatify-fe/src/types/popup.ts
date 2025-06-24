 

export type ActionButtonType = 'confirm' | 'close';

export interface ActionButton {
  title: string;
  type: ActionButtonType;
  onClick?: () => void;
}
