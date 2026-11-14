import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    normalizarFechaISO,
    calcularTotalEgresos,
    filtrarEgresos
} from '../src/viewmodels/egresosHelpers.js';

const datosEjemplo = [
    { clave: 3, monto: '950.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Renta' },
    { clave: 2, monto: '125.50', fecha: '2026-10-15T00:00:00.000Z', descripcion: 'Transporte' },
    { clave: 1, monto: '300.00', fecha: '2026-09-20T00:00:00.000Z', descripcion: null }
];

describe('egresosHelpers - Visualización de egresos', () => {
    it('normaliza fechas ISO y objetos Date en UTC sin desfase de día', () => {
        assert.equal(normalizarFechaISO('2026-10-28T00:00:00.000Z'), '2026-10-28');
        assert.equal(normalizarFechaISO(new Date('2026-10-01T00:00:00.000Z')), '2026-10-01');
        assert.equal(normalizarFechaISO('fecha-invalida'), '');
        assert.equal(normalizarFechaISO(null), '');
    });

    it('calcula el total de egresos sumando montos numéricos y cadenas decimales', () => {
        assert.equal(calcularTotalEgresos(datosEjemplo), 1375.5);
        assert.equal(calcularTotalEgresos([]), 0);
    });

    it('filtra por texto en descripción o monto sin distinguir mayúsculas', () => {
        const porDescripcion = filtrarEgresos(datosEjemplo, { busqueda: 'TRANSPORTE' });
        assert.equal(porDescripcion.length, 1);
        assert.equal(porDescripcion[0].clave, 2);

        const porMonto = filtrarEgresos(datosEjemplo, { busqueda: '950.00' });
        assert.equal(porMonto.length, 1);
        assert.equal(porMonto[0].clave, 3);
    });

    it('filtra por rango de fechas desde y hasta', () => {
        const octubre = filtrarEgresos(datosEjemplo, {
            fechaDesde: '2026-10-01',
            fechaHasta: '2026-10-31'
        });
        assert.equal(octubre.length, 2);
        assert.deepEqual(octubre.map((egreso) => egreso.clave), [3, 2]);
    });

    it('combina búsqueda de texto y filtro de fechas simultáneamente', () => {
        const combinados = filtrarEgresos(datosEjemplo, {
            busqueda: 'renta',
            fechaDesde: '2026-10-01',
            fechaHasta: '2026-10-31'
        });
        assert.equal(combinados.length, 1);
        assert.equal(combinados[0].clave, 3);
    });
});
