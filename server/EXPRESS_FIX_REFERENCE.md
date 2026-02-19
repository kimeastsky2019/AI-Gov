# Express v5 → v4 Migration Reference

## Problem
Express v5.2.1 doesn't properly export `NextFunction` and other types, causing TypeScript compilation to fail with errors like:
```
error TS1484: 'NextFunction' is a type and must be imported using a type-only import
```

## Solution Applied

### Step 1: Downgrade Dependencies
```bash
npm install express@4 @types/express@4
```

Result:
- express: ^4.22.1 (from ^5.2.1)
- @types/express: ^4.17.25 (compatible with Express v4)

### Step 2: Fix TypeScript Imports

**Wrong (Express v5 - causes TS1484 error):**
```typescript
import { Request, Response, NextFunction } from 'express';
```

**Correct (Express v4 - with type-only imports):**
```typescript
import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express'; // value import stays normal
```

### Step 3: Separate Type and Value Imports

**Pattern for route files:**
```typescript
import { Router } from 'express';                    // value import
import type { Request, Response } from 'express';   // type-only import
import type { AuthRequest } from '../middleware/auth.js'; // type-only custom type
```

**Pattern for middleware:**
```typescript
import type { Request, Response, NextFunction } from 'express'; // all types
import jwt from 'jsonwebtoken';                      // other imports
```

## Files Changed

1. `/src/index.ts`
2. `/src/middleware/auth.ts`
3. `/src/routes/auth.ts`
4. `/src/routes/ai-services.ts`
5. `/src/routes/compliance.ts`
6. `/src/routes/dashboard.ts`
7. `/src/routes/products.ts`
8. `/src/routes/risk-assessments.ts`

## Verification

```bash
# Type check
npx tsc --noEmit

# Compile
npx tsc

# Run
npm start
```

Expected output:
```
AI Governance Platform API Server
   Port: 3001 | Env: development
   Database: SQLite (WAL mode)
   API: http://localhost:3001/api/health
```

## Key Points

1. **Type-only imports** don't add runtime code, just compile-time type checking
2. **Value imports** (like `Router`) must use regular import syntax
3. **verbatimModuleSyntax** in tsconfig.json enforces proper type/value separation
4. **Express v4** is production-stable and has better type definitions than v5

## Troubleshooting

If you get TypeScript errors after this fix:
- Make sure ALL Express types use `import type`
- Don't mix `import { Type }` with `import type { Type }` from same module
- Run `npm install` to ensure correct package versions
- Clear `.tsbuildinfo` cache if issues persist: `rm .tsbuildinfo`

## Express v4 vs v5 Compatibility

Express v4 middleware works identically to v5:
```typescript
app.use((req, res, next) => { /* middleware */ });
app.get('/path', (req, res) => { /* handler */ });
app.use((err, req, res, next) => { /* error handler */ });
```

No code changes needed in middleware implementations, only import statements.
