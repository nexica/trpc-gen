# @nexica/trpc-gen

A custom Prisma generator for automatically creating NestJS TRPC routers for the Nexica-Stack.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

`@nexica/trpc-gen` is a Prisma generator that automatically creates NestJS TRPC routers, services, repositories, and modules for each model in your Prisma schema. This tool is specifically designed to work seamlessly with the [Nexica-Stack](https://github.com/link-to-nexica-stack) architecture.

## Nexica-Stack Packages

The Nexica-Stack consists of the following packages:

1. `@nexica/trpc-gen` - Prisma generator for NestJS TRPC routers (this package)
2. `@nexica/nestjs-trpc` - NestJS integration for tRPC with custom decorators
3. `@nexica/zod-gen` - Prisma generator for Zod validation schemas
4. `@nexica/cli` - CLI tool for creating and managing Nexica-Stack projects
5. `@nexica/client` - Frontend utilities for integrating with Nexica-Stack backends

## Features

- 🔄 Automatically generates TRPC routers from your Prisma schema
- 🧩 Creates complete module structure (router, service, repository)
- 🔌 Integrates generated modules into your NestJS application
- 🛡️ Includes authentication middleware scaffolding
- 📝 Utilizes Zod schemas for input/output validation

## Installation

```bash
# Using npm
npm install @nexica/trpc-gen --save-dev

# Using yarn
yarn add @nexica/trpc-gen --dev

# Using pnpm
pnpm add @nexica/trpc-gen -D
```

## Usage

Add the generator to your `schema.prisma` file:

```prisma
generator trpcRouter {
  provider = "@nexica/trpc-gen"
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

`@nexica/trpc-gen` will generate a full TRPC router with typed endpoints for creating, reading, updating, and deleting User records.

## Integration with Nexica-Stack

This generator is designed to work as part of the [Nexica-Stack](https://github.com/link-to-nexica-stack) ecosystem. It expects a specific project structure and relies on other components from the Nexica-Stack, such as:

- (Todo)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Jamie Fairweather

## All contributors

<a href="https://github.com/nexica/trpc-gen/graphs/contributors">
  <p align="center">
    <img width="720" height="50" src="https://contrib.rocks/image?repo=nexica/trpc-gen" alt="A table of avatars from the project's contributors" />
  </p>
</a>
