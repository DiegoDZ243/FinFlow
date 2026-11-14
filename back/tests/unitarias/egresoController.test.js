jest.mock('../../models', () => ({
    models: {
        Egreso: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
        },
    },
}));

const {
    obtenerEgresos,
    obtenerEgresoPorId,
    actualizarEgreso,
} = require('../../controllers/egresoController');
const { models } = require('../../models');

const makeRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(() => {
    console.error.mockRestore();
});

describe('obtenerEgresos', () => {
    test('devuelve los egresos del usuario autenticado ordenados por fecha descendente', async () => {
        const req = { user: { id: 17 } };
        const res = makeRes();
        const egresos = [{ clave: 1, monto: '50.00', ahorradorId: 17 }];
        models.Egreso.findAll.mockResolvedValue(egresos);

        await obtenerEgresos(req, res);

        expect(models.Egreso.findAll).toHaveBeenCalledWith({
            where: { ahorradorId: 17 },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
        expect(res.json).toHaveBeenCalledWith(egresos);
    });

    test('responde 500 si falla la consulta', async () => {
        const res = makeRes();
        models.Egreso.findAll.mockRejectedValue(new Error('Error BD'));

        await obtenerEgresos({ user: { id: 17 } }, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

describe('obtenerEgresoPorId', () => {
    test('devuelve un egreso propio', async () => {
        const res = makeRes();
        const egreso = { clave: 5, monto: '150.00', ahorradorId: 17 };
        models.Egreso.findByPk.mockResolvedValue(egreso);

        await obtenerEgresoPorId({ params: { id: '5' }, user: { id: 17 } }, res);

        expect(models.Egreso.findByPk).toHaveBeenCalledWith(5);
        expect(res.json).toHaveBeenCalledWith(egreso);
    });

    test.each(['abc', '0', '-3'])('rechaza un id inválido: %s', async (id) => {
        const res = makeRes();

        await obtenerEgresoPorId({ params: { id }, user: { id: 17 } }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Egreso.findByPk).not.toHaveBeenCalled();
    });

    test('no permite consultar el egreso de otro usuario', async () => {
        const res = makeRes();
        models.Egreso.findByPk.mockResolvedValue({ clave: 5, ahorradorId: 99 });

        await obtenerEgresoPorId({ params: { id: '5' }, user: { id: 17 } }, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});

describe('actualizarEgreso', () => {
    test('actualiza los campos permitidos de un egreso propio', async () => {
        const egreso = {
            clave: 5,
            ahorradorId: 17,
            update: jest.fn().mockResolvedValue(undefined),
        };
        const res = makeRes();
        models.Egreso.findByPk.mockResolvedValue(egreso);

        await actualizarEgreso({
            params: { id: '5' },
            user: { id: 17 },
            body: {
                monto: '175.50',
                fecha: '2026-10-29',
                descripcion: '  Comida  ',
                ahorradorId: 99,
            },
        }, res);

        expect(egreso.update).toHaveBeenCalledWith({
            monto: 175.5,
            fecha: '2026-10-29',
            descripcion: 'Comida',
        });
        expect(res.json).toHaveBeenCalledWith(egreso);
    });

    test('permite actualizar el monto máximo de 99,999,999.99', async () => {
        const egreso = {
            clave: 5,
            ahorradorId: 17,
            update: jest.fn().mockResolvedValue(undefined),
        };
        const res = makeRes();
        models.Egreso.findByPk.mockResolvedValue(egreso);

        await actualizarEgreso({
            params: { id: '5' },
            user: { id: 17 },
            body: { monto: 99999999.99 },
        }, res);

        expect(egreso.update).toHaveBeenCalledWith({ monto: 99999999.99 });
        expect(res.json).toHaveBeenCalledWith(egreso);
    });

    test.each([
        [{ monto: -1 }, 'El monto debe ser mayor a 0'],
        [{ monto: 100000000 }, 'El monto no puede ser mayor a 99,999,999.99'],
        [{ fecha: '2026-02-30' }, 'La fecha debe tener formato YYYY-MM-DD y ser válida'],
        [{ descripcion: 42 }, 'La descripción debe ser texto'],
        [{}, 'Proporciona al menos un campo para actualizar'],
    ])('rechaza datos inválidos', async (body, error) => {
        const egreso = { clave: 5, ahorradorId: 17, update: jest.fn() };
        const res = makeRes();
        models.Egreso.findByPk.mockResolvedValue(egreso);

        await actualizarEgreso({ params: { id: '5' }, user: { id: 17 }, body }, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error });
        expect(egreso.update).not.toHaveBeenCalled();
    });

    test('no permite actualizar el egreso de otro usuario', async () => {
        const res = makeRes();
        models.Egreso.findByPk.mockResolvedValue({ clave: 5, ahorradorId: 99 });

        await actualizarEgreso({
            params: { id: '5' },
            user: { id: 17 },
            body: { monto: 200 },
        }, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
