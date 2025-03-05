import { GeneratorOptions } from '@prisma/generator-helper'
import { DMMF } from '@prisma/generator-helper'
import * as path from 'path'
import * as fs from 'fs'
import { generateRouterFile } from './templates/router.template'
import { generateServiceFile } from './templates/service.template'
import { generateRepoFile } from './templates/repo.template'
import { generateModuleFile } from './templates/module.template'

function updateAppModule(model: DMMF.Model, baseOutputDir: string) {
    const srcDir = path.resolve(baseOutputDir)

    // Recursively search for trpc.module.ts by going up directories
    function findTrpcModule(startDir: string, maxDepth = 10): string | null {
        if (maxDepth <= 0) return null

        const trpcModulePath = path.join(startDir, 'trpc.module.ts')

        if (fs.existsSync(trpcModulePath)) {
            return trpcModulePath
        }

        // Check if we've reached root directory
        const parentDir = path.resolve(startDir, '..')
        if (parentDir === startDir) {
            return null
        }

        // Try the parent directory
        return findTrpcModule(parentDir, maxDepth - 1)
    }

    const trpcModulePath = findTrpcModule(srcDir)

    if (!trpcModulePath) {
        console.log(`[Generator] trpc.module.ts not found in directory tree (searched up from ${srcDir})`)
        return
    }

    console.log(`[Generator] Found trpc.module.ts at ${trpcModulePath}`)
    let content = fs.readFileSync(trpcModulePath, 'utf-8')
    const moduleName = `${model.name}Module`
    const importPath = `./routers/${model.name.toLowerCase()}/${model.name.toLowerCase()}.module`

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
        console.log(`[Generator] Could not find imports array in trpc.module.ts`)
    }

    fs.writeFileSync(trpcModulePath, content)
    console.log(`[Generator] Updated trpc.module.ts`)
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
