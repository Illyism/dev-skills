---
name: cleanup
description: Cleanup code, optimize, refactor, delete the 80% to keep the 20%
metadata:
  version: 1.0.0
  author: illyism
  source: https://il.ly/skills/cleanup
---

Cleanup command:

TARGET:

- If the user has attached files in this message, look at each file and run the CLEANUP ALGORITHM
- If not, look at the chat history and the files you changed recently, then check from there to clean up your working code
- If you have NO chat history, look at the current git state and try to clean up the code based on that

CLEANUP ALGORITHM:

1. **Scan exports** - For each file, check if all exports are actually used
   - Grep/search codebase for each exported function/type (hint: "func(" helps you find functions faster)
   - Mark unused exports, variables, files, functions, etc for deletion

2. **Clean from smallest to largest**:
   - **Variables**: Remove unused variables within functions
   - **Functions**: Delete unused helper functions
   - **Exports**: Remove unused exported functions
   - **Files**: If no exports remain or file is unused, delete entire file

3. **Quick wins**:
   - Remove `any` types
   - Delete barrel files (`index.ts` re-exports)
   - Simplify overly complex functions
   - Consolidate duplicate code
   - Split big complex files into smaller ones following best practices

4. **Type and query optimization**:
   - Inline types/interfaces in component props (don't export if only used once)
   - Remove explicit return types (let TypeScript infer)
   - Only select database fields that are actually used in queries
   - Make component prop types minimal (only fields that are accessed)

Start small (unused variables) → work up to large (unused files).
