import type { GlobalProvider } from '@ladle/react';
import '@unocss/reset/tailwind-compat.css';
import 'uno.css';

export const Provider: GlobalProvider = ({ children }) => <>{children}</>;
