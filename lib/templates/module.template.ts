import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'

export function generateModuleFile(model: DMMF.Model, outputPath: string) {
    const content = `import { Module } from '@nestjs/common'
import { ${model.name}Router } from './${model.name.toLowerCase()}.router'
import { ${model.name}Service } from './${model.name.toLowerCase()}.service'
import { ${model.name}Repo } from './${model.name.toLowerCase()}.repo'

@Module({
    providers: [${model.name}Router, ${model.name}Service, ${model.name}Repo],
})
export class ${model.name}Module {}`

    const filePath = path.join(outputPath, `${model.name.toLowerCase()}.module.ts`)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
    }
}
