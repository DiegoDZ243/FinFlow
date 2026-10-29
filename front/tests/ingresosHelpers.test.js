import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
    normalizarFechaISO,
    calcularTotalIngresos,
    filtrarIngresos
} from '../src/viewmodels/ingresosHelpers.js';

const datosEjemplo = [
    { clave: 3, monto: '5000.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Nómina quincenal' },
    { clave: 2, monto: '1250.50', fecha: '2026-10-15T00:00:00.000Z', descripcion: 'Proyecto freelance' },
    { clave: 1, monto: '300.00', fecha: '2026-09-20T00:00:00.000Z', descripcion: null }
];

describe('ingresosHelpers - Visualización de ingresos', () => {
    it('normaliza fechas ISO y objetos Date en UTC sin desfase de día', () => {
        assert.equal(normalizarFechaISO('2026-10-28T00:00:00.000Z'), '2026-10-28');
        assert.equal(normalizarFechaISO(new Date('2026-10-01T00:00:00.000Z')), '2026-10-01');
        assert.equal(normalizarFechaISO('fecha-invalida'), '');
        assert.equal(normalizarFechaISO(null), '');
    });

    it('calcula el total acumulado sumando montos numéricos y cadenas decimales', () => {
        assert.equal(calcularTotalIngresos(datosEjemplo), 6550.5);
        assert.equal(calcularTotalIngresos([]), 0);
    });

    it('filtra por texto en descripción o monto sin distinguir mayúsculas', () => {
        const porDescripcion = filtrarIngresos(datosEjemplo, { busqueda: 'FREELANCE' });
        assert.equal(porDescripcion.length, 1);
        assert.equal(porDescripcion[0].clave, 2);

        const porMonto = filtrarIngresos(datosEjemplo, { busqueda: '5000' });
        assert.equal(porMonto.length, 1);
        assert.equal(porMonto[0].clave, 3);
    });

    it('filtra por rango de fechas desde y hasta', () => {
        const octubre = filtrarIngresos(datosEjemplo, {
            fechaDesde: '2026-10-01',
            fechaHasta: '2026-10-31'
        });
        assert.equal(octubre.length, 2);
        assert.deepEqual(octubre.map((i) => i.clave), [3, 2]);
    });

    it('combina búsqueda de texto y filtro de fechas simultáneamente', () => {
        const combinados = filtrarIngresos(datosEjemplo, {
            busqueda: 'quincenal',
            fechaDesde: '2026-10-01',
            fechaHasta: '2026-10-31'
        });
        assert.equal(combinados.length, 1);
        assert.equal(combinados[0].clave, 3);
    });
});
