process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';

jest.mock('../../models', () => ({
    sequelize: {
        sync: jest.fn().mockResolvedValue(undefined),
    },
    models: {
        Ingreso: {},
        Egreso: {
            create: jest.fn(),
            findAll: jest.fn(),
            destroy: jest.fn(),
        },
        Ahorrador: {},
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

describe('Rutas /api/egresos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/egresos requiere autenticación', async () => {
        const res = await request(app).get('/api/egresos');

        expect(res.status).toBe(401);
        expect(models.Egreso.findAll).not.toHaveBeenCalled();
    });

    test('POST /api/egresos registra un egreso para el usuario autenticado', async () => {
        const egreso = {
            clave: 5,
            monto: 120,
            fecha: '2026-10-28',
            descripcion: 'Comida',
            ahorradorId: 17,
        };
        models.Egreso.create.mockResolvedValue(egreso);

        const res = await request(app)
            .post('/api/egresos')
            .set('Authorization', `Bearer ${generarToken()}`)
            .send({ monto: '120', fecha: '2026-10-28', descripcion: ' Comida ' });

        expect(res.status).toBe(201);
        expect(res.body).toEqual(egreso);
        expect(models.Egreso.create).toHaveBeenCalledWith({
            monto: 120,
            fecha: '2026-10-28',
            descripcion: 'Comida',
            ahorradorId: 17,
        });
    });

    test('POST /api/egresos rechaza montos inválidos', async () => {
        const res = await request(app)
            .post('/api/egresos')
            .set('Authorization', `Bearer ${generarToken()}`)
            .send({ monto: 0 });

        expect(res.status).toBe(400);
        expect(models.Egreso.create).not.toHaveBeenCalled();
    });

    test('POST /api/egresos rechaza montos mayores a 99,999,999.99', async () => {
        const res = await request(app)
            .post('/api/egresos')
            .set('Authorization', `Bearer ${generarToken()}`)
            .send({ monto: 100000000 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: 'El monto no puede ser mayor a 99,999,999.99' });
        expect(models.Egreso.create).not.toHaveBeenCalled();
    });

    test('POST /api/egresos permite el monto máximo de 99,999,999.99', async () => {
        const egreso = { clave: 5, monto: 99999999.99, ahorradorId: 17 };
        models.Egreso.create.mockResolvedValue(egreso);

        const res = await request(app)
            .post('/api/egresos')
            .set('Authorization', `Bearer ${generarToken()}`)
            .send({ monto: 99999999.99 });

        expect(res.status).toBe(201);
        expect(models.Egreso.create).toHaveBeenCalledWith({
            monto: 99999999.99,
            descripcion: null,
            ahorradorId: 17,
        });
    });

    test('POST /api/egresos requiere autenticación', async () => {
        const res = await request(app)
            .post('/api/egresos')
            .send({ monto: 120 });

        expect(res.status).toBe(401);
        expect(models.Egreso.create).not.toHaveBeenCalled();
    });

    test('GET /api/egresos devuelve solo registros del usuario autenticado', async () => {
        const egresos = [
            { clave: 4, monto: '120.00', fecha: '2026-10-28T00:00:00.000Z', descripcion: 'Comida', ahorradorId: 17 },
        ];
        models.Egreso.findAll.mockResolvedValue(egresos);

        const res = await request(app)
            .get('/api/egresos')
            .set('Authorization', `Bearer ${generarToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(egresos);
        expect(models.Egreso.findAll).toHaveBeenCalledWith({
            where: { ahorradorId: 17 },
            order: [['fecha', 'DESC'], ['clave', 'DESC']],
        });
    });

    test('DELETE /api/egresos/:id elimina solo un egreso del usuario autenticado', async () => {
        models.Egreso.destroy.mockResolvedValue(1);

        const res = await request(app)
            .delete('/api/egresos/4')
            .set('Authorization', `Bearer ${generarToken()}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ mensaje: 'Egreso eliminado correctamente' });
        expect(models.Egreso.destroy).toHaveBeenCalledWith({
            where: { clave: 4, ahorradorId: 17 },
        });
    });

    test('DELETE /api/egresos/:id devuelve 404 si no existe para el usuario', async () => {
        models.Egreso.destroy.mockResolvedValue(0);

        const res = await request(app)
            .delete('/api/egresos/4')
            .set('Authorization', `Bearer ${generarToken()}`);

        expect(res.status).toBe(404);
        expect(models.Egreso.destroy).toHaveBeenCalledWith({
            where: { clave: 4, ahorradorId: 17 },
        });
    });

    test('DELETE /api/egresos/:id rechaza identificadores inválidos', async () => {
        const res = await request(app)
            .delete('/api/egresos/abc')
            .set('Authorization', `Bearer ${generarToken()}`);

        expect(res.status).toBe(400);
        expect(models.Egreso.destroy).not.toHaveBeenCalled();
    });
});
