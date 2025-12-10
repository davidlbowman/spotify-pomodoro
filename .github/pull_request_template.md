## Summary

<!-- Brief description of what this PR does -->

## Changes

-

## Checklist

Before submitting, ensure you've reviewed [CONTRIBUTING.md](../CONTRIBUTING.md) and completed the following:

### Code Quality
- [ ] `bun run lint` passes
- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes

### Code Style
- [ ] JSDoc comments on all public exports (`@since`, `@category` tags)
- [ ] No inline (`//`) or block (`/* */`) comments - JSDoc only
- [ ] Effect services use `accessors: true` pattern
- [ ] Error types use `Schema.TaggedError`

### Database (if applicable)
- [ ] Migration file included (`bun run db:generate`)
- [ ] Migration tested locally (`bun run db:migrate`)

### Testing (if applicable)
- [ ] Tests added for new functionality
- [ ] Tests use `@effect/vitest` patterns

## Test Plan

<!-- How did you test these changes? -->

