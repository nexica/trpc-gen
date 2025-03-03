import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

export function generateRepoFile(model: DMMF.Model, outputPath: string) {
    const content = `import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { Prisma, ${model.name} } from '@prisma/client'
import { HandlePrismaError } from '@/prisma/prisma-error.decorator'
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

@Injectable()
export class ${model.name}Repo {
    constructor(private prisma: PrismaService) {}

    @HandlePrismaError({ entity: '${model.name}' })
    async findFirst(data: z.infer<typeof ${model.name}FindFirstArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.findFirst(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async findMany(data: z.infer<typeof ${model.name}FindManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.findMany(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async findUnique(data: z.infer<typeof ${model.name}FindUniqueArgsSchema>) {
        return data.select
            ? this.prisma.${model.name.toCamelCase()}.findUnique({
                  select: { ...data.select },
                  where: { ...data.where },
              })
            : this.prisma.${model.name.toCamelCase()}.findUnique({
                  include: { ...data.include },
                  where: { ...data.where },
              })
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async create(data: z.infer<typeof ${model.name}CreateArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.create(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async createMany(data: z.infer<typeof ${model.name}CreateManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.createMany(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async update(data: z.infer<typeof ${model.name}UpdateArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.update(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async updateMany(data: z.infer<typeof ${model.name}UpdateManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.updateMany(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async upsert(data: z.infer<typeof ${model.name}UpsertArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.upsert(data)
    }

    @HandlePrismaError({ entity: '${model.name}', notFoundReturnNull: true })
    async delete(data: z.infer<typeof ${model.name}DeleteArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.delete(data)
    }

    @HandlePrismaError({ entity: '${model.name}' })
    async deleteMany(data: z.infer<typeof ${model.name}DeleteManyArgsSchema>) {
        return this.prisma.${model.name.toCamelCase()}.deleteMany(data)
    }
}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.repo.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
