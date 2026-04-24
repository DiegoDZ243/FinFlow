import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { MetaProvider } from './context/MetaContext';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <MetaProvider>
                <App />
            </MetaProvider>
        </AuthProvider>
    </StrictMode>,
);