import type { GlobalProvider } from '@ladle/react';
import '@unocss/reset/tailwind.css';
import 'uno.css';

export const Provider: GlobalProvider = ({ children }) => <>{children}</>;
