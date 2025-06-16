import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

interface TemplateOptions {
    zodPath: string
}

export function generateServiceFile(model: DMMF.Model, outputPath: string, options: TemplateOptions) {
    const { zodPath } = options
    const mainSchemaName = `${model.name}${model.fields.some((field) => field.relationName) ? `WithPartialRelationsSchema` : `Schema`}`
    const content = `import { Injectable } from '@nestjs/common'
import { ${model.name}Repo } from './${model.name.toLowerCase()}.repo'
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

@Injectable()
export class ${model.name}Service {
    constructor(private ${model.name.toLowerCase()}Repo: ${model.name}Repo) {}

    async findFirst(data: z.infer<typeof ${model.name}FindFirstArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}> | null> {
        return await this.${model.name.toLowerCase()}Repo.findFirst(data)
    }

    async findMany(data: z.infer<typeof ${model.name}FindManyArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>[]> {
        return await this.${model.name.toLowerCase()}Repo.findMany(data)
    }

    async findUnique(data: z.infer<typeof ${model.name}FindUniqueArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}> | null> {
        return await this.${model.name.toLowerCase()}Repo.findUnique(data)
    }

    async create(data: z.infer<typeof ${model.name}CreateArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        return await this.${model.name.toLowerCase()}Repo.create(data)
    }

    async createMany(data: z.infer<typeof ${model.name}CreateManyArgsSchema>): Promise<void> {
        return await this.${model.name.toLowerCase()}Repo.createMany(data)
    }

    async update(data: z.infer<typeof ${model.name}UpdateArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        return await this.${model.name.toLowerCase()}Repo.update(data)
    }

    async updateMany(data: z.infer<typeof ${model.name}UpdateManyArgsSchema>): Promise<void> {
        return await this.${model.name.toLowerCase()}Repo.updateMany(data)
    }

    async upsert(data: z.infer<typeof ${model.name}UpsertArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        return await this.${model.name.toLowerCase()}Repo.upsert(data)
    }

    async delete(data: z.infer<typeof ${model.name}DeleteArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        return await this.${model.name.toLowerCase()}Repo.delete(data)
    }

    async deleteMany(data: z.infer<typeof ${model.name}DeleteManyArgsSchema>): Promise<void> {
        return await this.${model.name.toLowerCase()}Repo.deleteMany(data)
    }
}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.service.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
