process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

jest.mock('../../models', () => ({
    sequelize: {
        sync: jest.fn().mockResolvedValue(undefined),
    },
    models: {
        Ingreso: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn(),
        },
        Ahorrador: {},
        Egreso: {},
        Meta: {},
        PlanDeAhorro: {},
        AporteMeta: {},
    },
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { models } = require('../../models');

const generarToken = (id = 17) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Rutas /api/ingresos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/ingresos rechaza peticiones sin token con 401', async () => {
        const res = await request(app).get('/api/ingresos');

        expect(res.status).toBe(401);
        expect(models.Ingreso.findAll).not.toHaveBeenCalled();
    });

    test('GET /api/ingresos devuelve 200 con la lista de ingresos del usuario', async () => {
        const ingresos = [
            { clave: 3, monto: '2400.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Salario', ahorradorId: 17 },
        ];
        models.Ingreso.findAll.mockResolvedValue(ingresos);

        const res = await request(app)
            .get('/api/ingresos')
            .set('Authorization', `Bearer ${generarToken(17)}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(ingresos);
        expect(models.Ingreso.findAll).toHaveBeenCalledWith({
            where: { ahorradorId: 17 },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
    });

    test('GET /api/ingresos/:id devuelve 200 cuando el ingreso pertenece al usuario', async () => {
        const ingreso = { clave: 3, monto: '2400.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Salario', ahorradorId: 17 };
        models.Ingreso.findByPk.mockResolvedValue(ingreso);

        const res = await request(app)
            .get('/api/ingresos/3')
            .set('Authorization', `Bearer ${generarToken(17)}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(ingreso);
    });
});
