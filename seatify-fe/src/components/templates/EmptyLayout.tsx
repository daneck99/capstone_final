 

import { ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

const EmptyLayout = ({ children }: EmptyLayoutProps) => {
  return <div>{children}</div>;
};

export default EmptyLayout;
