import { GeneratorOptions } from '@prisma/generator-helper'
import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'
import { generateRouterFile } from './templates/router.template'
import { generateServiceFile } from './templates/service.template'
import { generateRepoFile } from './templates/repo.template'

function generateModuleFile(model: DMMF.Model, outputPath: string) {
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

function updateAppModule(model: DMMF.Model, baseOutputDir: string) {
    const srcDir = path.resolve(baseOutputDir, '../..')
    const appModulePath = path.join(srcDir, 'app.module.ts')

    if (!fs.existsSync(appModulePath)) {
        console.log(`[Generator] app.module.ts not found at ${appModulePath}`)
        return
    }

    console.log(`[Generator] Found app.module.ts at ${appModulePath}`)
    let content = fs.readFileSync(appModulePath, 'utf-8')
    const moduleName = `${model.name}Module`
    const importPath = `./trpc/routers/${model.name.toLowerCase()}/${model.name.toLowerCase()}.module`

    // Check if import already exists
    const importRegex = new RegExp(`import\\s*{\\s*${moduleName}\\s*}\\s*from\\s*['"]${importPath}['"]`)
    if (!importRegex.test(content)) {
        console.log(`[Generator] Adding import for ${moduleName}`)
        // Find the last import statement
        const importStatements = content.match(/^import.*$/gm) || []
        if (importStatements.length > 0) {
            const lastImport = importStatements[importStatements.length - 1]
            const lastImportIndex = content.indexOf(lastImport) + lastImport.length
            const newImport = `\nimport { ${moduleName} } from '${importPath}'`
            content = content.slice(0, lastImportIndex) + newImport + content.slice(lastImportIndex)
        }
    } else {
        console.log(`[Generator] Import for ${moduleName} already exists`)
    }

    // Check if module is already in imports array
    const moduleDecoratorRegex = /@Module\(\{[\s\S]*?imports:\s*\[([\s\S]*?)\]/
    const moduleMatch = content.match(moduleDecoratorRegex)

    if (moduleMatch) {
        const currentImports = moduleMatch[1]
        if (!currentImports.includes(moduleName)) {
            console.log(`[Generator] Adding ${moduleName} to imports array`)
            // Add module to imports array
            const newImports = currentImports ? `${currentImports.trim()}, ${moduleName}` : moduleName
            content = content.replace(moduleDecoratorRegex, (match) => match.replace(/imports:\s*\[([\s\S]*?)\]/, `imports: [${newImports}]`))
        } else {
            console.log(`[Generator] ${moduleName} already in imports array`)
        }
    } else {
        console.log(`[Generator] Could not find imports array in app.module.ts`)
    }

    fs.writeFileSync(appModulePath, content)
    console.log(`[Generator] Updated app.module.ts`)
}

export async function generate(options: GeneratorOptions) {
    const { generator, dmmf } = options
    const baseOutputDir = generator.output?.value ?? 'src/modules'

    // Create modules directory if it doesn't exist
    if (!fs.existsSync(baseOutputDir)) {
        fs.mkdirSync(baseOutputDir, { recursive: true })
    }

    // Generate files for each model
    for (const model of dmmf.datamodel.models) {
        const modelOutputPath = path.join(baseOutputDir, model.name.toLowerCase())

        // Create model directory if it doesn't exist
        if (!fs.existsSync(modelOutputPath)) {
            fs.mkdirSync(modelOutputPath, { recursive: true })
        }

        generateRouterFile(model, modelOutputPath)
        generateServiceFile(model, modelOutputPath)
        generateRepoFile(model, modelOutputPath)
        generateModuleFile(model, modelOutputPath)
        updateAppModule(model, baseOutputDir)
    }

    return Promise.resolve()
}
