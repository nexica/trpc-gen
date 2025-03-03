# @nexa/trpc-gen

A custom Prisma generator for automatically creating NestJS TRPC routers for the Nexa-Stack.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`@nexa/trpc-gen` is a Prisma generator that automatically creates NestJS TRPC routers, services, repositories, and modules for each model in your Prisma schema. This tool is specifically designed to work seamlessly with the [Nexa-Stack](https://github.com/link-to-nexa-stack) architecture.

## Nexa-Stack Packages

The Nexa-Stack consists of the following packages:

1. `@nexa/trpc-gen` - Prisma generator for NestJS TRPC routers (this package)
2. `@nexa/nestjs-trpc` - NestJS integration for tRPC with custom decorators
3. `@nexa/zod-gen` - Prisma generator for Zod validation schemas
4. `@nexa/cli` - CLI tool for creating and managing Nexa-Stack projects
5. `@nexa/client` - Frontend utilities for integrating with Nexa-Stack backends

## Features

- 🔄 Automatically generates TRPC routers from your Prisma schema
- 🧩 Creates complete module structure (router, service, repository)
- 🔌 Integrates generated modules into your NestJS application
- 🛡️ Includes authentication middleware scaffolding
- 📝 Utilizes Zod schemas for input/output validation

## Installation

```bash
# Using npm
npm install @nexa/trpc-gen --save-dev

# Using yarn
yarn add @nexa/trpc-gen --dev

# Using pnpm
pnpm add @nexa/trpc-gen -D
```

## Usage

Add the generator to your `schema.prisma` file:

```prisma
generator trpcRouter {
  provider = "@nexa/trpc-gen"
  output   = "./src/trpc/routers" // Optional: defaults to src/modules
}
```

Then run your Prisma generation:

```bash
npx prisma generate
```

This will generate:

- A directory for each model
- Router, Service, and Repository files for each model
- NestJS modules for each model
- Automatically updates your `app.module.ts` file with new module imports

## Generated Structure

For each model in your Prisma schema, the following files will be generated:

```
src/trpc/routers/
  └── modelname/
      ├── modelname.router.ts    # TRPC router with all CRUD operations
      ├── modelname.service.ts   # Service layer with business logic
      ├── modelname.repo.ts      # Repository layer for database operations
      └── modelname.module.ts    # NestJS module configuration
```

## Example

For a Prisma model like:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

`@nexa/trpc-gen` will generate a full TRPC router with typed endpoints for creating, reading, updating, and deleting User records.

## Integration with Nexa-Stack

This generator is designed to work as part of the [Nexa-Stack](https://github.com/link-to-nexa-stack) ecosystem. It expects a specific project structure and relies on other components from the Nexa-Stack, such as:

- (Todo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Jamie Fairweather
