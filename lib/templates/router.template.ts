import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

interface TemplateOptions {
    zodPath: string
}

export function generateRouterFile(model: DMMF.Model, outputPath: string, options: TemplateOptions) {
    const { zodPath } = options
    const mainSchemaName = `${model.name}${model.fields.some((field) => field.relationName) ? `WithPartialRelationsSchema` : `Schema`}`
    const content = `import { Inject } from '@nestjs/common'
import { Input, Mutation, Query, Router, Subscription, createEventSubscription } from '@nexica/nestjs-trpc'
import { ${model.name}Service } from './${model.name.toLowerCase()}.service'
import {
    ${mainSchemaName},
    ${model.name}CreateArgsSchema,
    ${model.name}FindManyArgsSchema,
    ${model.name}FindUniqueArgsSchema,
    ${model.name}UpdateArgsSchema,
    ${model.name}DeleteArgsSchema,
    ${model.name}FindFirstArgsSchema,
    ${model.name}CreateManyArgsSchema,
    ${model.name}UpdateManyArgsSchema,
    ${model.name}DeleteManyArgsSchema,
    ${model.name}UpsertArgsSchema,
} from '${zodPath}'
import { z } from 'zod/v4'

@Router()
export class ${model.name}Router {
    constructor(
        @Inject(${model.name}Service)
        private readonly ${model.name.toLowerCase()}Service: ${model.name}Service
    ) {}

    @Query({
        input: ${model.name}FindFirstArgsSchema,
        output: ${mainSchemaName}.nullable(),
    })
    async findFirst(@Input() input: z.infer<typeof ${model.name}FindFirstArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findFirst(input)
    }

    @Query({
        input: ${model.name}FindManyArgsSchema,
        output: z.array(${mainSchemaName}),
    })
    async findMany(@Input() input: z.infer<typeof ${model.name}FindManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findMany(input)
    }

    @Query({
        input: ${model.name}FindUniqueArgsSchema,
        output: ${mainSchemaName}.nullable(),
    })
    async findUnique(@Input() input: z.infer<typeof ${model.name}FindUniqueArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.findUnique(input)
    }

    @Mutation({
        input: ${model.name}CreateArgsSchema,
        output: ${mainSchemaName},
    })
    async create(@Input() input: z.infer<typeof ${model.name}CreateArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.create(input)
    }

    @Mutation({
        input: ${model.name}CreateManyArgsSchema,
    })
    async createMany(@Input() input: z.infer<typeof ${model.name}CreateManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.createMany(input)
    }

    @Mutation({
        input: ${model.name}UpdateArgsSchema,
        output: ${mainSchemaName},
    })
    async update(@Input() input: z.infer<typeof ${model.name}UpdateArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.update(input)
    }

    @Mutation({
        input: ${model.name}UpdateManyArgsSchema,
    })
    async updateMany(@Input() input: z.infer<typeof ${model.name}UpdateManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.updateMany(input)
    }

    @Mutation({
        input: ${model.name}UpsertArgsSchema,
        output: ${mainSchemaName},
    })
    async upsert(@Input() input: z.infer<typeof ${model.name}UpsertArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.upsert(input)
    }

    @Mutation({
        input: ${model.name}DeleteArgsSchema,
        output: ${mainSchemaName},
    })
    async delete(@Input() input: z.infer<typeof ${model.name}DeleteArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.delete(input)
    }

    @Mutation({
        input: ${model.name}DeleteManyArgsSchema,
    })
    async deleteMany(@Input() input: z.infer<typeof ${model.name}DeleteManyArgsSchema>) {
        return await this.${model.name.toLowerCase()}Service.deleteMany(input)
    }

    @Subscription({
        output: ${mainSchemaName},
    })
    async *on${model.name}Created(): AsyncIterable<z.infer<typeof ${mainSchemaName}>> {
        const { subscription } = createEventSubscription<z.infer<typeof ${mainSchemaName}>>({
            eventEmitter: this.${model.name.toLowerCase()}Service.getEventEmitter(),
            eventName: '${model.name.toLowerCase()}.created',
            maxQueueSize: 100,
            resilientMode: true,
        })

        yield* subscription
    }

    @Subscription({
        output: ${mainSchemaName},
    })
    async *on${model.name}Updated(): AsyncIterable<z.infer<typeof ${mainSchemaName}>> {
        const { subscription } = createEventSubscription<z.infer<typeof ${mainSchemaName}>>({
            eventEmitter: this.${model.name.toLowerCase()}Service.getEventEmitter(),
            eventName: '${model.name.toLowerCase()}.updated',
            maxQueueSize: 100,
            resilientMode: true,
        })

        yield* subscription
    }

    @Subscription({
        output: ${mainSchemaName},
    })
    async *on${model.name}Upserted(): AsyncIterable<z.infer<typeof ${mainSchemaName}>> {
        const { subscription } = createEventSubscription<z.infer<typeof ${mainSchemaName}>>({
            eventEmitter: this.${model.name.toLowerCase()}Service.getEventEmitter(),
            eventName: '${model.name.toLowerCase()}.upserted',
            maxQueueSize: 100,
            resilientMode: true,
        })

        yield* subscription
    }

    @Subscription({
        output: ${mainSchemaName},
    })
    async *on${model.name}Deleted(): AsyncIterable<z.infer<typeof ${mainSchemaName}>> {
        const { subscription } = createEventSubscription<z.infer<typeof ${mainSchemaName}>>({
            eventEmitter: this.${model.name.toLowerCase()}Service.getEventEmitter(),
            eventName: '${model.name.toLowerCase()}.deleted',
            maxQueueSize: 100,
            resilientMode: true,
        })

        yield* subscription
    }
}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.router.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
