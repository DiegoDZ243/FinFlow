jest.mock('../../models', () => ({
    models: {
        Ingreso: {
            create: jest.fn(),
        },
    },
}));

const { crearIngreso } = require('../../controllers/ingresoController');
const { models } = require('../../models');

const makeRes = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

const makeReq = (body = {}) => ({
    body: {
        monto: '1250.50',
        fecha: '2026-10-28',
        descripcion: 'Pago mensual',
        ...body,
    },
    user: { id: 17 },
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

describe('crearIngreso', () => {
    test('crea el ingreso asociado al usuario autenticado y devuelve 201', async () => {
        const req = makeReq({ ahorradorId: 999 });
        const res = makeRes();
        const ingreso = { clave: 1, monto: '1250.50', ahorradorId: 17 };
        models.Ingreso.create.mockResolvedValue(ingreso);

        await crearIngreso(req, res);

        expect(models.Ingreso.create).toHaveBeenCalledWith({
            monto: 1250.5,
            fecha: '2026-10-28',
            descripcion: 'Pago mensual',
            ahorradorId: 17,
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(ingreso);
    });

    test.each([0, -1, 'no-numérico', undefined])('rechaza monto inválido: %s', async (monto) => {
        const req = makeReq({ monto });
        const res = makeRes();

        await crearIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.create).not.toHaveBeenCalled();
    });

    test('rechaza una fecha inválida', async () => {
        const req = makeReq({ fecha: '2026-02-30' });
        const res = makeRes();

        await crearIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.create).not.toHaveBeenCalled();
    });

    test('devuelve 500 si falla la persistencia', async () => {
        const req = makeReq();
        const res = makeRes();
        models.Ingreso.create.mockRejectedValue(new Error('Error BD'));

        await crearIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});