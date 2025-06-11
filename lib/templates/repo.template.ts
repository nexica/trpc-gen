import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

interface TemplateOptions {
    zodPath: string
}

export function generateRepoFile(model: DMMF.Model, outputPath: string, options: TemplateOptions) {
    const { zodPath } = options
    const content = `import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import {
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

    async findFirst(data: z.infer<typeof ${model.name}FindFirstArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.findFirst(data)
    }

    async findMany(data: z.infer<typeof ${model.name}FindManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.findMany(data)
    }

    async findUnique(data: z.infer<typeof ${model.name}FindUniqueArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.findUnique(data)
    }

    async create(data: z.infer<typeof ${model.name}CreateArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.create(data)
    }

    async createMany(data: z.infer<typeof ${model.name}CreateManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.createMany(data)
    }

    async update(data: z.infer<typeof ${model.name}UpdateArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.update(data)
    }

    async updateMany(data: z.infer<typeof ${model.name}UpdateManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.updateMany(data)
    }

    async upsert(data: z.infer<typeof ${model.name}UpsertArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.upsert(data)
    }

    async delete(data: z.infer<typeof ${model.name}DeleteArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.delete(data)
    }

    async deleteMany(data: z.infer<typeof ${model.name}DeleteManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.deleteMany(data)
    }
}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.repo.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
