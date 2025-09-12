# Issues Tracker

This directory contains all tracked issues for the Liberation Sprint project.

## Issue Status Legend

- 🔴 **Critical** - Blocking issues that prevent workshop deployment
- 🟡 **Important** - Issues that impact user experience but don't block deployment  
- 🟢 **Enhancement** - Nice-to-have improvements
- ✅ **Resolved** - Fixed and verified issues

## Priority Levels

- **P0** - Critical, blocking workshop use
- **P1** - Important, should be fixed soon
- **P2** - Nice to have, can be deferred

## Current Issues

### Critical (P0) Issues

*None currently - all critical issues resolved!*

### Resolved Issues

- [#001 - Timer System Not Implemented](001-timer-system-not-implemented.md) ✅ **RESOLVED** (2025-09-09)

### Important (P1) Issues

*None currently*

### Enhancements (P2) 

*None currently*

## Issue Template

When creating new issues, use this format:

```markdown
# Issue #XXX: [Title]

**Status:** [🔴/🟡/🟢/✅]  
**Priority:** [P0/P1/P2]  
**Created:** YYYY-MM-DD  
**Assignee:** [Name or Unassigned]  
**Labels:** `tag1`, `tag2`, `tag3`  

## Summary
Brief description of the issue

## Impact  
How this affects users/workshops

## Technical Details
Code snippets, error messages, etc.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior  
What actually happens

## Proposed Solution
How to fix it

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

## Testing Integration

All issues should be validated through the MCP Playwright testing framework located in `/tests/` directory.

## Workflow

1. **Discovery**: Issues found through testing or usage
2. **Documentation**: Create detailed issue file
3. **Prioritization**: Assign P0/P1/P2 priority  
4. **Implementation**: Fix the issue
5. **Verification**: Test the fix
6. **Resolution**: Update status to ✅ and document fix