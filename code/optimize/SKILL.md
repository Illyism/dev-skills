---
name: optimize
description: Optimizes code, queries, and features based on actual usage by removing unused fields, aggregations, JOINs, and unused complexity. Use when the user invokes /optimize or asks to slim queries to what the UI actually uses.
metadata:
  version: 1.0.0
  author: illyism
  source: https://il.ly/skills/optimize
---

TARGET:

- Optimize code/queries/features based on ACTUAL usage, not assumptions
- Remove everything that's not needed
- Question every field, query, feature, and piece of complexity

ALGORITHM:

1. **Audit actual usage**:
   - Grep/search codebase for each field/query/feature usage
   - Check UI components - what fields are actually rendered?
   - Check queries - what fields are actually selected?
   - Check APIs - what data is actually returned?

2. **Remove aggressively**:
   - Delete unused fields from SELECT queries
   - Remove expensive aggregations if not displayed
   - Drop unused exports, functions, components
   - Eliminate unnecessary JOINs, GROUP BYs, subqueries

3. **Optimize for reality**:
   - Base SELECT on actual UI needs (not "might need later")
   - Use scalar subqueries instead of JOINs when possible
   - Remove fields only used for filtering (keep in WHERE, remove from SELECT)
   - Cache only what's actually accessed frequently

4. **Simplify ruthlessly**:
   - If it's expensive and not used → remove it
   - If it's "nice to have" → remove it
   - If it adds complexity without clear benefit → remove it
   - Question: "Would users notice if this disappeared?" If no → remove

5. **Conclusion**:
   - When modifying a file, improve code quality in the surrounding area
   - Apply consistent patterns (e.g., error handling, naming conventions)
   - Extract duplicated logic if it appears 3+ times
   - Fix obvious issues (unused imports, inconsistent formatting)
   - Update related tests/types to match changes
   - Keep refactors small and focused - don't rewrite entire files
   - Verify UI still works as expected
   - Document breaking changes if any

**Example**: Query optimization - removed unused aggregate fields and dropped SELECT columns that were only needed for WHERE, kept only fields actually displayed in UI.
