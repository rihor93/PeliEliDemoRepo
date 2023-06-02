import React from 'react';
import { 
  Store, 
  StoreContext 
} from '../../store';

export const StoreProvider: React.FC<{ 
  children: React.ReactNode, 
  store: Store 
}> = ({ children, store }) => {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
};