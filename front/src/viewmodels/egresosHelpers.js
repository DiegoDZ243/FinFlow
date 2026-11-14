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

export const calcularTotalEgresos = (lista = []) => {
    return lista.reduce((acumulado, egreso) => {
        const monto = Number(egreso?.monto);
        return Number.isFinite(monto) ? acumulado + monto : acumulado;
    }, 0);
};

export const filtrarEgresos = (egresos = [], { busqueda = '', fechaDesde = '', fechaHasta = '' } = {}) => {
    const termino = busqueda.trim().toLowerCase();

    return egresos.filter((egreso) => {
        const fechaISO = normalizarFechaISO(egreso.fecha);

        if (fechaDesde && (!fechaISO || fechaISO < fechaDesde)) {
            return false;
        }

        if (fechaHasta && (!fechaISO || fechaISO > fechaHasta)) {
            return false;
        }

        if (termino) {
            const descripcion = (egreso.descripcion || 'sin descripción').toLowerCase();
            const montoNumero = Number(egreso.monto);
            const montoTexto = String(egreso.monto ?? '').toLowerCase();
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
