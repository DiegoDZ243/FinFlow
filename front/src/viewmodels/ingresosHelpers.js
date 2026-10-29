export const normalizarFechaISO = (fecha) => {
    if (!fecha) return '';

    if (typeof fecha === 'string') {
        const match = fecha.match(/^\d{4}-\d{2}-\d{2}/);
        if (match) return match[0];
    }

    const parsed = new Date(fecha);
    if (Number.isNaN(parsed.getTime())) return '';

    const yyyy = parsed.getUTCFullYear();
    const mm = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

export const calcularTotalIngresos = (lista = []) => {
    return lista.reduce((acumulado, ingreso) => {
        const monto = Number(ingreso?.monto);
        return Number.isFinite(monto) ? acumulado + monto : acumulado;
    }, 0);
};

export const filtrarIngresos = (ingresos = [], { busqueda = '', fechaDesde = '', fechaHasta = '' } = {}) => {
    const termino = busqueda.trim().toLowerCase();

    return ingresos.filter((ingreso) => {
        const fechaISO = normalizarFechaISO(ingreso.fecha);

        if (fechaDesde && (!fechaISO || fechaISO < fechaDesde)) {
            return false;
        }

        if (fechaHasta && (!fechaISO || fechaISO > fechaHasta)) {
            return false;
        }

        if (termino) {
            const descripcion = (ingreso.descripcion || 'sin descripción').toLowerCase();
            const montoNumero = Number(ingreso.monto);
            const montoTexto = String(ingreso.monto ?? '').toLowerCase();
            const montoDecimal = Number.isFinite(montoNumero) ? montoNumero.toFixed(2) : '';

            return (
                descripcion.includes(termino) ||
                montoTexto.includes(termino) ||
                montoDecimal.includes(termino)
            );
        }

        return true;
    });
};
