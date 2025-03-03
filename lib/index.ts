#!/usr/bin/env node
import { generatorHandler } from '@prisma/generator-helper'
import { generate } from './generator'
// Import string extensions
import './utils/string-extensions'

generatorHandler({
    onManifest() {
        return {
            defaultOutput: 'generated',
            prettyName: 'NestJS TRPC Router Generator',
        }
    },
    onGenerate: generate,
})
