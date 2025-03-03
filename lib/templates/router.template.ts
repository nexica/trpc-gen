import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

export function generateRouterFile(model: DMMF.Model, outputPath: string) {
    const content = `import { Inject } from '@nestjs/common'
import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc'
import { ${model.name}Service } from './${model.name.toLowerCase()}.service'
import { AuthMiddleware } from '@/trpc/middleware/auth/auth.middleware'
import {
    ${model.name}CreateArgsSchema,
    ${model.name}Schema,
    ${model.name}FindManyArgsSchema,
    ${model.name}FindUniqueArgsSchema,
    ${model.name}UpdateArgsSchema,
    ${model.name}DeleteArgsSchema,
    ${model.name}FindFirstArgsSchema,
    ${model.name}CreateManyArgsSchema,
    ${model.name}UpdateManyArgsSchema,
    ${model.name}DeleteManyArgsSchema,
    ${model.name}UpsertArgsSchema,
} from '@/zod'
import { z } from 'zod'

@Router()
@UseMiddlewares(AuthMiddleware)
export class ${model.name}Router {
    constructor(
        @Inject(${model.name}Service)
        private readonly ${model.name.toLowerCase()}Service: ${model.name}Service
    ) {}

    @Query({
        input: ${model.name}FindFirstArgsSchema,
        output: ${model.name}Schema.nullable(),
    })
    async findFirst(@Input() input: z.infer<typeof ${model.name}FindFirstArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findFirst(input)
    }

    @Query({
        input: ${model.name}FindManyArgsSchema,
        output: z.array(${model.name}Schema),
    })
    async findMany(@Input() input: z.infer<typeof ${model.name}FindManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findMany(input)
    }

    @Query({
        input: ${model.name}FindUniqueArgsSchema,
        output: ${model.name}Schema.nullable(),
    })
    async findUnique(@Input() input: z.infer<typeof ${model.name}FindUniqueArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findUnique(input)
    }

    @Mutation({
        input: ${model.name}CreateArgsSchema,
        output: ${model.name}Schema,
    })
    async create(@Input() input: z.infer<typeof ${model.name}CreateArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.create(input)
    }

    @Mutation({
        input: ${model.name}CreateManyArgsSchema,
        output: z.object({ count: z.number() }),
    })
    async createMany(@Input() input: z.infer<typeof ${model.name}CreateManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.createMany(input)
    }

    @Mutation({
        input: ${model.name}UpdateArgsSchema,
        output: ${model.name}Schema,
    })
    async update(@Input() input: z.infer<typeof ${model.name}UpdateArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.update(input)
    }

    @Mutation({
        input: ${model.name}UpdateManyArgsSchema,
        output: z.object({ count: z.number() }),
    })
    async updateMany(@Input() input: z.infer<typeof ${model.name}UpdateManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.updateMany(input)
    }

    @Mutation({
        input: ${model.name}UpsertArgsSchema,
        output: ${model.name}Schema,
    })
    async upsert(@Input() input: z.infer<typeof ${model.name}UpsertArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.upsert(input)
    }

    @Mutation({
        input: ${model.name}DeleteArgsSchema,
        output: ${model.name}Schema.nullable(),
    })
    async delete(@Input() input: z.infer<typeof ${model.name}DeleteArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.delete(input)
    }

    @Mutation({
        input: ${model.name}DeleteManyArgsSchema,
        output: z.object({ count: z.number() }),
    })
    async deleteMany(@Input() input: z.infer<typeof ${model.name}DeleteManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.deleteMany(input)
    }

}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.router.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
