import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/metas" className="navbar-logo">
                    FinFlow
                </Link>
                
                <ul className="navbar-menu">
                    <li>
                        <Link to="/metas" className="navbar-link">
                            Metas
                        </Link>
                    </li>
                    <li>
                        <Link to="/ingresos" className="navbar-link">
                            Ingresos
                        </Link>
                    </li>
                    <li>
                        <Link to="/egresos" className="navbar-link">
                            Egresos
                        </Link>
                    </li>
                </ul>

                <div className="navbar-user">
                    <span className="user-email">{user?.email}</span>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
