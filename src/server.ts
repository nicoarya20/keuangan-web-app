import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { prisma } from './lib/prisma'

const app = new Elysia()
    .use(cors())
    .onError(({ code, error }) => {
        console.error(`Error [${code}]:`, error);
        return { error: error.message };
    })
    .get('/', () => ({ status: 'ok', message: 'Elysia is running' }))
    .get('/api/incomes', () => prisma.income.findMany({ orderBy: { createdAt: 'desc' } }))
    .post('/api/incomes', ({ body }) => prisma.income.create({ data: body }), {
        body: t.Object({
            amount: t.Number(),
            category: t.String(),
            date: t.String(),
            recurring: t.Boolean(),
            note: t.Optional(t.Nullable(t.String()))
        })
    })
    .delete('/api/incomes/:id', ({ params: { id } }) => prisma.income.delete({ where: { id } }))

    .get('/api/expenses', () => prisma.expense.findMany({ orderBy: { createdAt: 'desc' } }))
    .post('/api/expenses', ({ body }) => {
        const { tags, ...rest } = body;
        return prisma.expense.create({
            data: {
                ...rest,
                tags: tags ? tags.join(',') : null
            }
        });
    }, {
        body: t.Object({
            amount: t.Number(),
            category: t.String(),
            date: t.String(),
            note: t.Optional(t.Nullable(t.String())),
            tags: t.Optional(t.Nullable(t.Array(t.String())))
        })
    })
    .delete('/api/expenses/:id', ({ params: { id } }) => prisma.expense.delete({ where: { id } }))

    .get('/api/wishlist', () => prisma.wishlistItem.findMany({ orderBy: { createdAt: 'desc' } }))
    .post('/api/wishlist', ({ body }) => prisma.wishlistItem.create({ data: body }), {
        body: t.Object({
            name: t.String(),
            targetPrice: t.Number(),
            currentProgress: t.Optional(t.Number()),
            priority: t.String(),
            note: t.Optional(t.Nullable(t.String()))
        })
    })
    .patch('/api/wishlist/:id', ({ params: { id }, body }) => prisma.wishlistItem.update({
        where: { id },
        data: body
    }), {
        body: t.Partial(t.Object({
            name: t.String(),
            targetPrice: t.Number(),
            currentProgress: t.Number(),
            priority: t.String(),
            note: t.Nullable(t.String())
        }))
    })
    .delete('/api/wishlist/:id', ({ params: { id } }) => prisma.wishlistItem.delete({ where: { id } }))

    .get('/api/savings', () => prisma.saving.findMany({ orderBy: { createdAt: 'desc' } }))
    .post('/api/savings', ({ body }) => prisma.saving.create({ data: body }), {
        body: t.Object({
            amount: t.Number(),
            goalName: t.String(),
            date: t.String(),
            type: t.String()
        })
    })
    .delete('/api/savings/:id', ({ params: { id } }) => prisma.saving.delete({ where: { id } }))

    .get('/api/budgets', () => prisma.categoryBudget.findMany())
    .post('/api/budgets', async ({ body }) => {
        return prisma.categoryBudget.upsert({
            where: { category: body.category },
            update: { amount: body.amount },
            create: { category: body.category, amount: body.amount }
        });
    }, {
        body: t.Object({
            category: t.String(),
            amount: t.Number()
        })
    })
    .listen({
        port: 4000,
        hostname: '127.0.0.1'
    })

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
