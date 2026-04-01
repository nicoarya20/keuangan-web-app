import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { prisma } from './lib/prisma'

const app = new Elysia()
    .use(cors())
    .use(swagger())
    .group('/api', (app) =>
        app
            // Incomes
            .get('/incomes', () => prisma.income.findMany({ orderBy: { createdAt: 'desc' } }))
            .post('/incomes', ({ body }) => prisma.income.create({ data: body }), {
                body: t.Object({
                    amount: t.Number(),
                    category: t.String(),
                    date: t.String(),
                    recurring: t.Boolean(),
                    note: t.Optional(t.String())
                })
            })
            .delete('/incomes/:id', ({ params: { id } }) => prisma.income.delete({ where: { id } }))

            // Expenses
            .get('/expenses', () => prisma.expense.findMany({ orderBy: { createdAt: 'desc' } }))
            .post('/expenses', ({ body }) => {
                const { tags, ...rest } = body;
                return prisma.expense.create({
                    data: {
                        ...rest,
                        tags: tags ? tags.join(',') : null
                    }
                })
            }, {
                body: t.Object({
                    amount: t.Number(),
                    category: t.String(),
                    date: t.String(),
                    note: t.Optional(t.String()),
                    tags: t.Optional(t.Array(t.String()))
                })
            })
            .delete('/expenses/:id', ({ params: { id } }) => prisma.expense.delete({ where: { id } }))

            // Savings
            .get('/savings', () => prisma.saving.findMany({ orderBy: { createdAt: 'desc' } }))
            .post('/savings', ({ body }) => prisma.saving.create({ data: body }), {
                body: t.Object({
                    amount: t.Number(),
                    goalName: t.String(),
                    date: t.String(),
                    type: t.String() // 'saving' | 'investment'
                })
            })
            .delete('/savings/:id', ({ params: { id } }) => prisma.saving.delete({ where: { id } }))

            // Wishlist
            .get('/wishlist', () => prisma.wishlistItem.findMany({ orderBy: { createdAt: 'desc' } }))
            .post('/wishlist', ({ body }) => prisma.wishlistItem.create({ data: body }), {
                body: t.Object({
                    name: t.String(),
                    targetPrice: t.Number(),
                    currentProgress: t.Number(),
                    priority: t.String(), // 'low' | 'medium' | 'high'
                    note: t.Optional(t.String())
                })
            })
            .patch('/wishlist/:id', ({ params: { id }, body }) => prisma.wishlistItem.update({
                where: { id },
                data: body
            }), {
                body: t.Partial(t.Object({
                    name: t.String(),
                    targetPrice: t.Number(),
                    currentProgress: t.Number(),
                    priority: t.String(),
                    note: t.String()
                }))
            })
            .delete('/wishlist/:id', ({ params: { id } }) => prisma.wishlistItem.delete({ where: { id } }))

            // Category Budgets
            .get('/budgets', () => prisma.categoryBudget.findMany())
            .post('/budgets', ({ body }) => {
                return prisma.categoryBudget.upsert({
                    where: { category: body.category },
                    update: { amount: body.amount },
                    create: { category: body.category, amount: body.amount }
                })
            }, {
                body: t.Object({
                    category: t.String(),
                    amount: t.Number()
                })
            })
    )
    .listen(3001)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
