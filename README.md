# Family Story Creator

Family Story Creator helps guide users by working with them to request information about a particular family member and generate a tory about their life.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `ai-server`: a [mastra.js](https://mastra.ai/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Build

To build all apps and packages, run the following command from project root:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command from project root:

```
pnpm dev
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turborepo.com/docs/core-concepts/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
