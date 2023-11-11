import { ReactNode } from 'react';

const Content = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-4/5 p-4 flex flex-col">
      <p>{children}</p>
    </div>
  );
};

export default Content;
