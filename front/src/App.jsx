import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginView from './views/Auth/LoginView';
import MetasList from './views/Metas/MetasList';
import CrearMetaView from './views/Metas/CrearMetaView';
import DetalleMetaView from './views/Metas/DetalleMetaView';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f1a', color: '#eaeaea' }}>Cargando...</div>;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

const LoginRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f0f1a', color: '#eaeaea' }}>Cargando...</div>;
    }
    
    if (isAuthenticated) {
        return <Navigate to="/metas" replace />;
    }
    
    return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginRoute><LoginView /></LoginRoute>} />
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Navigate to="/metas" replace />} />
                    <Route path="metas" element={<MetasList />} />
                    <Route path="metas/nueva" element={<CrearMetaView />} />
                    <Route path="metas/:id" element={<DetalleMetaView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;