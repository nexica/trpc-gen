import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

interface TemplateOptions {
    zodPath: string
}

export function generateRepoFile(model: DMMF.Model, outputPath: string, options: TemplateOptions) {
    const { zodPath } = options
    const mainSchemaName = `${model.name}${model.fields.some((field) => field.relationName) ? `WithPartialRelationsSchema` : `Schema`}`
    const content = `import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
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
export class ${model.name}Repo {
    constructor(private prisma: PrismaService) {}

    async findFirst(data: z.infer<typeof ${model.name}FindFirstArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}> | null> {
        const result = await this.prisma.${model.name.toCamelCase()}.findFirst(data)
        if (!result) return null
        return ${mainSchemaName}.parse(result)
    }

    async findMany(data: z.infer<typeof ${model.name}FindManyArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>[]> {
        const result = await this.prisma.${model.name.toCamelCase()}.findMany(data)
        return result.map((item) => ${mainSchemaName}.parse(item))
    }

    async findUnique(data: z.infer<typeof ${model.name}FindUniqueArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}> | null> {
        const result = await this.prisma.${model.name.toCamelCase()}.findUnique(data)
        if (!result) return null
        return ${mainSchemaName}.parse(result)
    }

    async create(data: z.infer<typeof ${model.name}CreateArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        const result = await this.prisma.${model.name.toCamelCase()}.create(data)
        return ${mainSchemaName}.parse(result)
    }

    async createMany(data: z.infer<typeof ${model.name}CreateManyArgsSchema>): Promise<void> {
        await this.prisma.${model.name.toCamelCase()}.createMany(data)
    }

    async update(data: z.infer<typeof ${model.name}UpdateArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        const result = await this.prisma.${model.name.toCamelCase()}.update(data)
        return ${mainSchemaName}.parse(result)
    }

    async updateMany(data: z.infer<typeof ${model.name}UpdateManyArgsSchema>): Promise<void> {
        await this.prisma.${model.name.toCamelCase()}.updateMany(data)
    }

    async upsert(data: z.infer<typeof ${model.name}UpsertArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        const result = await this.prisma.${model.name.toCamelCase()}.upsert(data)
        return ${mainSchemaName}.parse(result)
    }

    async delete(data: z.infer<typeof ${model.name}DeleteArgsSchema>): Promise<z.infer<typeof ${mainSchemaName}>> {
        const result = await this.prisma.${model.name.toCamelCase()}.delete(data)
        return ${mainSchemaName}.parse(result)
    }

    async deleteMany(data: z.infer<typeof ${model.name}DeleteManyArgsSchema>): Promise<void> {
        await this.prisma.${model.name.toCamelCase()}.deleteMany(data)
    }
}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.repo.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
