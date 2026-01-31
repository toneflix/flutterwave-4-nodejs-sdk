# Contributing to Flutterwave Node.js SDK v4

Thank you for your interest in contributing to the Flutterwave Node.js SDK v4! We welcome contributions from the community and appreciate your help in making this SDK better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Documentation](#documentation)
- [Questions](#questions)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors. Please be considerate and professional in all interactions.

## Getting Started

### Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - This project uses pnpm as the package manager
- **Git**

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## Development Setup

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/flutterwave-4-nodejs-sdk.git
   cd flutterwave-4-nodejs-sdk
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/toneflix/flutterwave-4-nodejs-sdk.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Add your Flutterwave credentials:

   ```env
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   ENCRYPTION_KEY=your_encryption_key
   ENVIRONMENT=sandbox
   SECRET_HASH=your_webhook_secret_hash
   ```

   Note: Use sandbox credentials for testing.

6. **Build the project**

   ```bash
   pnpm build
   ```

7. **Run tests**

   ```bash
   pnpm test
   ```

## Project Structure

```
flutterwave-4-nodejs-sdk/
├── src/
│   ├── Apis/              # API endpoint implementations
│   ├── Contracts/         # TypeScript interfaces and types
│   ├── Exceptions/        # Custom exception classes
│   ├── Routing/           # Router implementation
│   ├── utilities/         # Helper functions and utilities
│   ├── Builder.ts         # Request builder
│   ├── Flutterwave.ts     # Main SDK class
│   ├── Http.ts            # HTTP client
│   └── index.ts           # Main exports
├── tests/                 # Test files
│   ├── api.spec.ts        # API tests
│   ├── more.api.spec.ts   # Additional API tests
│   ├── base.spec.ts       # Base functionality tests
│   └── routing.spec.ts    # Router tests
├── docs/                  # Documentation
│   ├── guide/             # User guides
│   ├── api/               # API reference
│   └── examples/          # Usage examples
├── dist/                  # Compiled output (generated)
└── package.json           # Package configuration
```

## Making Changes

### Creating a Branch

Always create a new branch for your changes:

```bash
# For new features
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description

# For documentation
git checkout -b docs/what-you-are-documenting
```

### Branch Naming Convention

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Maintenance tasks

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm quick:test

# Run specific test file
pnpm vitest tests/api.spec.ts
```

### Writing Tests

All new features and bug fixes should include tests. We use Vitest for testing.

Example test structure:

```typescript
import { describe, it, expect } from 'vitest';
import { Flutterwave } from '../src/Flutterwave';

describe('Feature Name', () => {
  it('should do something specific', async () => {
    const flutterwave = new Flutterwave({
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      environment: 'sandbox',
    });

    const result = await flutterwave.api.someMethod();

    expect(result).toBeDefined();
    expect(result.status).toBe('success');
  });
});
```

### Test Guidelines

- Write descriptive test names that explain what is being tested
- Test both success and failure scenarios
- Mock external API calls when appropriate
- Ensure tests are idempotent (can run multiple times)
- Clean up any resources created during tests

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Provide proper type definitions for all functions and variables
- Avoid using `any` type; use proper types or generics
- Export interfaces and types that consumers might need
- Use descriptive variable and function names

### Code Formatting

This project uses ESLint for linting:

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors (where possible)
pnpm lint --fix
```

### Code Style Rules

- Use **2 spaces** for indentation
- Use **single quotes** for strings (unless using template literals)
- Add semicolons at the end of statements
- Use **camelCase** for variables and functions
- Use **PascalCase** for classes and interfaces
- Use **UPPER_CASE** for constants
- Add JSDoc comments for public APIs

Example:

```typescript
/**
 * Creates a new transfer
 * @param transferData - The transfer details
 * @param traceId - Optional trace ID for tracking
 * @returns The created transfer object
 */
async function createTransfer(
  transferData: TransferPayload,
  traceId?: string,
): Promise<Transfer> {
  // Implementation
}
```

## Commit Guidelines

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```bash
feat(transfers): add support for scheduled transfers

Add the ability to schedule transfers for a future date.
Includes validation and documentation updates.

Closes #123
```

```bash
fix(webhooks): correct signature validation for special characters

The webhook validator was failing when payload contained special
characters due to encoding issues. Fixed by using raw body properly.

Fixes #456
```

```bash
docs(api): update virtual accounts examples

Added more examples for dynamic virtual accounts and improved
existing documentation with better error handling patterns.
```

## Submitting a Pull Request

### Before Submitting

1. **Update your branch** with the latest changes from upstream:

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** to ensure everything passes:

   ```bash
   pnpm test
   ```

3. **Run linting** to check code style:

   ```bash
   pnpm lint
   ```

4. **Build the project** to ensure it compiles:

   ```bash
   pnpm build
   ```

5. **Update documentation** if you've changed any APIs

### Creating the Pull Request

1. Push your changes to your fork:

   ```bash
   git push origin your-branch-name
   ```

2. Go to the repository on GitHub and click "New Pull Request"

3. Select your fork and branch

4. Fill in the PR template with:
   - **Title**: Clear, concise description of changes
   - **Description**: Detailed explanation of what and why
   - **Related Issues**: Reference any related issues (e.g., "Fixes #123")
   - **Type of Change**: Feature, bug fix, documentation, etc.
   - **Testing**: Describe how you tested your changes
   - **Screenshots**: If applicable (for documentation or UI changes)

5. Submit the pull request

### PR Review Process

- A maintainer will review your PR
- You may be asked to make changes
- Once approved, your PR will be merged
- Your contribution will be credited in the release notes

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated (if needed)
- [ ] Commits follow conventional commits format
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] All checks passing

## Reporting Bugs

### Before Reporting

1. **Search existing issues** to see if the bug has been reported
2. **Test with the latest version** to ensure it's not already fixed
3. **Verify it's not a configuration issue** in your setup

### Creating a Bug Report

When creating a bug report, include:

1. **Clear title** describing the issue
2. **Environment details**:
   - SDK version
   - Node.js version
   - Operating system
   - Package manager (npm/yarn/pnpm)
3. **Steps to reproduce** the issue
4. **Expected behavior**
5. **Actual behavior**
6. **Code sample** demonstrating the issue (if possible)
7. **Error messages** or stack traces
8. **Screenshots** (if applicable)

Example:

````markdown
## Bug Report

**SDK Version**: 0.1.0
**Node.js Version**: v20.10.0
**OS**: macOS Sonoma 14.2

### Description

Transfer creation fails with invalid signature error when using special characters in narration.

### Steps to Reproduce

1. Initialize SDK with valid credentials
2. Create transfer with narration containing special characters: "Payment for café ☕"
3. Call `transfers.directTransfer()`

### Expected Behavior

Transfer should be created successfully with the narration preserved.

### Actual Behavior

Error thrown: "Invalid signature"

### Code Sample

\```typescript
const transfer = await flutterwave.api.transfers.directTransfer({
narration: "Payment for café ☕",
// ... other fields
});
\```

### Error Message

\```
BadRequestException: Invalid signature for request
at Http.request (src/Http.ts:45)
...
\```
````

## Suggesting Features

### Feature Request Guidelines

When suggesting a feature:

1. **Search existing issues** to avoid duplicates
2. **Use a clear, descriptive title**
3. **Provide detailed description** of the feature
4. **Explain the use case** and why it's needed
5. **Provide examples** of how it would be used
6. **Consider alternatives** you've thought about

Example:

````markdown
## Feature Request

### Feature Description

Add support for recurring transfers with customizable schedules.

### Use Case

Many businesses need to set up recurring payments (salaries, subscriptions, etc.)
that execute automatically on a schedule.

### Proposed API

```typescript
const recurringTransfer = await flutterwave.api.transfers.createRecurring({
  schedule: {
    frequency: 'monthly',
    dayOfMonth: 1,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
  },
  transferData: {
    // ... transfer details
  },
});
```

### Alternatives Considered

- Manual cron jobs (not ideal, requires external setup)
- Webhooks + scheduler (complex for users)

### Benefits

- Simplified recurring payment setup
- Built-in retry logic
- Better tracking and management
````

## Documentation

### Updating Documentation

Documentation is located in the `docs/` directory and uses VitePress.

1. **Install VitePress** (if not already installed):

   ```bash
   pnpm add -D vitepress vue
   ```

2. **Preview documentation locally**:

   ```bash
   cd docs
   pnpm vitepress dev
   ```

3. **Documentation structure**:
   - `/docs/guide/` - User guides and tutorials
   - `/docs/api/` - API reference documentation
   - `/docs/examples/` - Code examples and use cases

4. **Documentation guidelines**:
   - Use clear, concise language
   - Include code examples for all APIs
   - Add type information for TypeScript
   - Keep examples practical and realistic
   - Test all code examples to ensure they work
   - No emoji usage in documentation

### Types of Documentation

- **API Reference**: Document all public methods, parameters, return types
- **Guides**: Step-by-step tutorials for common tasks
- **Examples**: Real-world usage scenarios
- **README**: Keep the main README updated with any API changes

## Questions

### Where to Ask Questions

- **GitHub Discussions**: For general questions and discussions
- **GitHub Issues**: For bug reports and feature requests (not general questions)
- **Stack Overflow**: Tag with `flutterwave` and `node.js`

### Getting Help

If you need help with your contribution:

1. Check existing documentation and examples
2. Search closed issues for similar problems
3. Ask in GitHub Discussions
4. Reach out to maintainers if needed

## Additional Resources

- [Flutterwave API Documentation](https://developer.flutterwave.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

## License

By contributing, you agree that your contributions will be licensed under the MIT License, the same license as the project.

## Recognition

Contributors will be recognized in:

- The project's README (if significant contribution)
- Release notes for the version containing their changes
- GitHub's contributor list

Thank you for contributing to Flutterwave Node.js SDK v4!
