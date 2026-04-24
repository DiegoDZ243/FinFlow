import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './PerfilView.css';

const PerfilView = () => {
    const { user } = useAuth();

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <div className="perfil-header">
                    <div className="perfil-avatar">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <h2>Mi Perfil</h2>
                </div>
                
                <div className="perfil-body">
                    <div className="info-group">
                        <label>Correo Electrónico</label>
                        <p>{user?.email}</p>
                    </div>
                    
                    <div className="info-group">
                        <label>Identificador de Usuario</label>
                        <p className="user-id">{user?.id || 'ID-FINFLOW-2026'}</p>
                    </div>

                    <div className="info-group">
                        <label>Estado de Cuenta</label>
                        <p><span className="status-badge">Activa</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilView;