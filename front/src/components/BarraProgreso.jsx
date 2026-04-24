import './BarraProgreso.css';

const BarraProgreso = ({ actual, objetivo }) => {
    const porcentaje = objetivo > 0 ? Math.min(100, (actual / objetivo) * 100) : 0;
    
    const getColorClass = () => {
        if (porcentaje >= 75) return 'progreso-verde';
        if (porcentaje >= 25) return 'progreso-amarillo';
        return 'progreso-rojo';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount);
    };

    return (
        <div className="barra-progreso-container">
            <div className="progreso-info">
                <span className="progreso-texto">
                    {formatCurrency(actual)} de {formatCurrency(objetivo)}
                </span>
                <span className="progreso-porcentaje">{porcentaje.toFixed(1)}%</span>
            </div>
            <div className="progreso-barra">
                <div 
                    className={`progreso-fill ${getColorClass()}`}
                    style={{ width: `${porcentaje}%` }}
                />
            </div>
        </div>
    );
};

export default BarraProgreso;
