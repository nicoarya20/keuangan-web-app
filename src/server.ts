import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { prisma } from './lib/prisma'
import { auth } from './lib/auth'

const app = new Elysia({
    // Trust proxy for Vercel
    precompile: true,
})
    .use(cors({
        origin: [
            'http://localhost:5173',
            'https://keuangan-web-app.vercel.app'
        ],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization']
    }))
    .use(swagger())
    .get('/', () => ({ status: 'Elysia is running' }))
    // Mount Better Auth at root - it will use its own basePath (/api/auth)
    .mount(auth.handler)
    .derive(async ({ request }) => {
        try {
            const session = await auth.api.getSession({ headers: request.headers })
            return { session }
        } catch (e) {
            return { session: null }
        }
    })
    .onError(({ code, error, set }) => {
        console.error(`API Error [${code}]:`, error)
        if (error instanceof Error) {
            console.error('Stack:', error.stack)
        }
        const message = error instanceof Error ? error.message : String(error)
        return {
            status: 'error',
            code,
            message,
            // Include more details in development or for specific codes
            details: process.env.NODE_ENV !== 'production' ? error : undefined
        }
    })
    .group('/api', (app) =>
        app
            // Incomes
            .get('/incomes', ({ session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.income.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' }
                })
            })
            .post('/incomes', ({ body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.income.create({
                    data: { ...body, userId: session.user.id }
                })
            }, {
                body: t.Object({
                    amount: t.Number(),
                    category: t.String(),
                    date: t.String(),
                    recurring: t.Boolean(),
                    note: t.Optional(t.String())
                })
            })
            .delete('/incomes/:id', async ({ params: { id }, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const income = await prisma.income.findUnique({ where: { id } })
                if (!income || income.userId !== session.user.id) {
                    set.status = 403
                    return { error: 'Forbidden' }
                }
                return prisma.income.delete({ where: { id } })
            })

            // Expenses
            .get('/expenses', ({ session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.expense.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' }
                })
            })
            .post('/expenses', ({ body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const { tags, ...rest } = body;
                return prisma.expense.create({
                    data: {
                        ...rest,
                        userId: session.user.id,
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
            .delete('/expenses/:id', async ({ params: { id }, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const expense = await prisma.expense.findUnique({ where: { id } })
                if (!expense || expense.userId !== session.user.id) {
                    set.status = 403
                    return { error: 'Forbidden' }
                }
                return prisma.expense.delete({ where: { id } })
            })

            // Savings
            .get('/savings', ({ session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.saving.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' }
                })
            })
            .post('/savings', ({ body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.saving.create({
                    data: { ...body, userId: session.user.id }
                })
            }, {
                body: t.Object({
                    amount: t.Number(),
                    goalName: t.String(),
                    date: t.String(),
                    type: t.String() // 'saving' | 'investment'
                })
            })
            .delete('/savings/:id', async ({ params: { id }, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const saving = await prisma.saving.findUnique({ where: { id } })
                if (!saving || saving.userId !== session.user.id) {
                    set.status = 403
                    return { error: 'Forbidden' }
                }
                return prisma.saving.delete({ where: { id } })
            })

            // Wishlist
            .get('/wishlist', ({ session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.wishlistItem.findMany({
                    where: { userId: session.user.id },
                    orderBy: { createdAt: 'desc' }
                })
            })
            .post('/wishlist', ({ body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.wishlistItem.create({
                    data: { ...body, userId: session.user.id }
                })
            }, {
                body: t.Object({
                    name: t.String(),
                    targetPrice: t.Number(),
                    currentProgress: t.Number(),
                    priority: t.String(), // 'low' | 'medium' | 'high'
                    note: t.Optional(t.String())
                })
            })
            .patch('/wishlist/:id', async ({ params: { id }, body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const item = await prisma.wishlistItem.findUnique({ where: { id } })
                if (!item || item.userId !== session.user.id) {
                    set.status = 403
                    return { error: 'Forbidden' }
                }
                return prisma.wishlistItem.update({
                    where: { id },
                    data: body
                })
            }, {
                body: t.Partial(t.Object({
                    name: t.String(),
                    targetPrice: t.Number(),
                    currentProgress: t.Number(),
                    priority: t.String(),
                    note: t.String()
                }))
            })
            .delete('/wishlist/:id', async ({ params: { id }, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                const item = await prisma.wishlistItem.findUnique({ where: { id } })
                if (!item || item.userId !== session.user.id) {
                    set.status = 403
                    return { error: 'Forbidden' }
                }
                return prisma.wishlistItem.delete({ where: { id } })
            })

            // Category Budgets
            .get('/budgets', ({ session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.categoryBudget.findMany({
                    where: { userId: session.user.id }
                })
            })
            .post('/budgets', ({ body, session, set }) => {
                if (!session) {
                    set.status = 401
                    return { error: 'Unauthorized' }
                }
                return prisma.categoryBudget.upsert({
                    where: {
                        userId_category: {
                            userId: session.user.id,
                            category: body.category
                        }
                    },
                    update: { amount: body.amount },
                    create: {
                        userId: session.user.id,
                        category: body.category,
                        amount: body.amount
                    }
                })
            }, {
                body: t.Object({
                    category: t.String(),
                    amount: t.Number()
                })
            })
    )

if (process.env.NODE_ENV !== 'production') {
    app.listen(3001)
    console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)
}

export default app
