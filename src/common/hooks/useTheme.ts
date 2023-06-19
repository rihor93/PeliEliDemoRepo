import React from 'react';
import { GlobalContext } from '../providers/ThemeProvider';
export const useTheme = () => React.useContext(GlobalContext);