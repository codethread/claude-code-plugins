# Learning Tests

## What They Are

Small, executable assertions that verify your understanding of a black-box dependency before you build against it. Not unit tests for your code — tests for your assumptions about someone else's code.

## When to Write Them

**Mandatory** (must write before proceeding to Refine):
- Binary CLIs — you can't read their source, so you must run them
- Closed-source APIs and SaaS endpoints
- Any tool where the only documentation is external and may be stale

**Strongly recommended** (write unless source inspection fully resolves the question):
- Libraries where behaviour depends on combinations of options
- APIs with sparse documentation or surprising edge cases
- Any dependency where getting it wrong would invalidate your plan

**Not needed** when you can read the actual source (in-repo code, `node_modules/`, cloned upstream) and the implementation unambiguously answers your question.

**Concrete example**: testing Claude Code CLI flags. Many flags don't work, and others interact in unexpected ways. A plan that assumes `--flag-x` works will fail at build time. A learning test discovers this in minutes.

### Autonomy

Don't wait for the user to ask you to verify. The moment research surfaces a black-box dependency, transition directly to writing learning tests. This is the expected workflow — research tells you what to test, learning tests tell you what's actually true.

## How to Write Them

### Pattern

```typescript
// learning-test: [tool/api name]
// question: does --json flag work with --print?

import { $ } from "bun";

const result = await $`claude --print --json "hello"`.text();
const parsed = JSON.parse(result);
console.assert(parsed.content !== undefined, "--json with --print should return structured output");
console.log("PASS: --json works with --print");
```

### Rules

1. **One assumption per test** — don't bundle multiple questions
2. **Executable** — must run and produce a clear pass/fail
3. **Minimal** — smallest possible code that tests the assumption
4. **Named** — file name describes what's being tested, e.g. `lt-claude-cli-json-flag.ts`
5. **Documented** — comment at top states the question being answered

### Shell-Based Learning Tests

For CLI tools, bash is often simpler:

```bash
#!/usr/bin/env bash
# learning-test: gh cli
# question: does gh pr list support --json with custom fields?

result=$(gh pr list --json number,title,labels --limit 1 2>&1)
if echo "$result" | jq '.[0].number' > /dev/null 2>&1; then
  echo "PASS: gh pr list supports --json with custom fields"
else
  echo "FAIL: gh pr list --json with custom fields: $result"
  exit 1
fi
```

## What to Do With Results

- **All pass**: assumptions validated, proceed to Refine with confidence
- **Some fail**: update your understanding, adjust the feature design, re-test
- **Most fail**: the dependency doesn't work as expected — fundamentally rethink the approach before planning

## Output

Save learning test files in `.dev/<feature>/` alongside `research.md`. They serve as executable documentation of verified behaviour — future iterations can re-run them to detect regressions in dependencies.

Name files with `lt-` prefix: `.dev/<feature>/lt-claude-cli-flags.ts`, `.dev/<feature>/lt-stripe-webhooks.sh`.
