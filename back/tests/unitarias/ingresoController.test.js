const { Op } = require('sequelize');

jest.mock('../../models', () => ({
    models: {
        Ingreso: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByPk: jest.fn(),
            destroy: jest.fn(),
        },
    },
}));

const {
    crearIngreso,
    obtenerIngresos,
    obtenerIngresoPorId,
    eliminarIngreso,
} = require('../../controllers/ingresoController');
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

describe('obtenerIngresos', () => {
    test('devuelve todos los ingresos del ahorrador autenticado ordenados por fecha descendente', async () => {
        const req = { user: { id: 17 }, query: {} };
        const res = makeRes();
        const listaIngresos = [
            { clave: 2, monto: '3500.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Quincena', ahorradorId: 17 },
            { clave: 1, monto: '800.00', fecha: '2026-10-15T00:00:00.000Z', descripcion: 'Bono', ahorradorId: 17 },
        ];
        models.Ingreso.findAll.mockResolvedValue(listaIngresos);

        await obtenerIngresos(req, res);

        expect(models.Ingreso.findAll).toHaveBeenCalledWith({
            where: { ahorradorId: 17 },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
        expect(res.json).toHaveBeenCalledWith(listaIngresos);
    });

    test('devuelve arreglo vacío cuando el usuario no tiene ingresos registrados', async () => {
        const req = { user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findAll.mockResolvedValue([]);

        await obtenerIngresos(req, res);

        expect(models.Ingreso.findAll).toHaveBeenCalledWith({
            where: { ahorradorId: 17 },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('filtra por rango de fechas cuando se envían fechaInicio y fechaFin válidas', async () => {
        const req = {
            user: { id: 17 },
            query: { fechaInicio: '2026-10-01', fechaFin: '2026-10-31' },
        };
        const res = makeRes();
        models.Ingreso.findAll.mockResolvedValue([]);

        await obtenerIngresos(req, res);

        expect(models.Ingreso.findAll).toHaveBeenCalledWith({
            where: {
                ahorradorId: 17,
                fecha: {
                    [Op.gte]: new Date('2026-10-01T00:00:00.000Z'),
                    [Op.lte]: new Date('2026-10-31T23:59:59.999Z'),
                },
            },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('rechaza fechaInicio o fechaFin con formato inválido con 400', async () => {
        const req = {
            user: { id: 17 },
            query: { fechaInicio: '2026-02-30' },
        };
        const res = makeRes();

        await obtenerIngresos(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.findAll).not.toHaveBeenCalled();
    });

    test('rechaza cuando fechaInicio es posterior a fechaFin con 400', async () => {
        const req = {
            user: { id: 17 },
            query: { fechaInicio: '2026-10-28', fechaFin: '2026-10-01' },
        };
        const res = makeRes();

        await obtenerIngresos(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.findAll).not.toHaveBeenCalled();
    });

    test('devuelve 500 si ocurre un error al consultar ingresos', async () => {
        const req = { user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findAll.mockRejectedValue(new Error('Error BD'));

        await obtenerIngresos(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

describe('obtenerIngresoPorId', () => {
    test('devuelve el ingreso si existe y pertenece al usuario autenticado', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        const ingreso = { clave: 5, monto: '1500.00', ahorradorId: 17 };
        models.Ingreso.findByPk.mockResolvedValue(ingreso);

        await obtenerIngresoPorId(req, res);

        expect(models.Ingreso.findByPk).toHaveBeenCalledWith(5);
        expect(res.json).toHaveBeenCalledWith(ingreso);
    });

    test.each(['abc', '0', '-3'])('devuelve 400 si el id es inválido: %s', async (id) => {
        const req = { params: { id }, user: { id: 17 } };
        const res = makeRes();

        await obtenerIngresoPorId(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.findByPk).not.toHaveBeenCalled();
    });

    test('devuelve 404 si el ingreso no existe', async () => {
        const req = { params: { id: '99' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockResolvedValue(null);

        await obtenerIngresoPorId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Ingreso no encontrado' });
    });

    test('devuelve 403 si el ingreso pertenece a otro usuario', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockResolvedValue({ clave: 5, monto: '1500.00', ahorradorId: 99 });

        await obtenerIngresoPorId(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ error: 'No tiene permiso para acceder a este ingreso' });
    });

    test('devuelve 500 si falla la consulta', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockRejectedValue(new Error('Error BD'));

        await obtenerIngresoPorId(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});

describe('eliminarIngreso', () => {
    test('elimina el ingreso del usuario autenticado y devuelve 200', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        const ingreso = {
            clave: 5,
            ahorradorId: 17,
            destroy: jest.fn().mockResolvedValue(undefined),
        };
        models.Ingreso.findByPk.mockResolvedValue(ingreso);

        await eliminarIngreso(req, res);

        expect(models.Ingreso.findByPk).toHaveBeenCalledWith(5);
        expect(ingreso.destroy).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ message: 'Ingreso eliminado correctamente' });
    });

    test.each(['abc', '0', '-3'])('devuelve 400 si el id es inválido: %s', async (id) => {
        const req = { params: { id }, user: { id: 17 } };
        const res = makeRes();

        await eliminarIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(models.Ingreso.findByPk).not.toHaveBeenCalled();
    });

    test('devuelve 404 si el ingreso no existe', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockResolvedValue(null);

        await eliminarIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Ingreso no encontrado' });
    });

    test('devuelve 403 si el ingreso pertenece a otro usuario', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        const ingreso = { ahorradorId: 99, destroy: jest.fn() };
        models.Ingreso.findByPk.mockResolvedValue(ingreso);

        await eliminarIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'No tiene permiso para eliminar este ingreso',
        });
        expect(ingreso.destroy).not.toHaveBeenCalled();
    });

    test('devuelve 500 si ocurre un error al consultar el ingreso', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockRejectedValue(new Error('Error BD'));

        await eliminarIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });

    test('devuelve 500 si falla el borrado', async () => {
        const req = { params: { id: '5' }, user: { id: 17 } };
        const res = makeRes();
        models.Ingreso.findByPk.mockResolvedValue({
            ahorradorId: 17,
            destroy: jest.fn().mockRejectedValue(new Error('Error BD')),
        });

        await eliminarIngreso(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
});
