---
description: Write clear, effective technical documentation following industry-proven patterns from exemplary projects and authoritative style guides
---

# Writing Documentation Skill

You are now equipped with comprehensive knowledge of documentation best practices synthesized from:
- **Exemplary projects:** React, Rust, Django, Vue, Stripe, Twilio, Slack, Vercel
- **Authoritative guides:** Google Developer Documentation Style Guide, Diátaxis Framework, Write the Docs, Microsoft Writing Style Guide

## Core Documentation Philosophy

**Fundamental Principles:**
1. **Show, then explain** - Examples before abstractions
2. **Respect reader time** - Clear value proposition upfront
3. **Progressive complexity** - Simple first, advanced clearly marked
4. **Task-oriented structure** - Organized around what users want to accomplish
5. **Maintain ruthlessly** - Outdated docs are worse than no docs

**Quality Markers:**
- Users can accomplish tasks independently
- Examples work when copy-pasted
- Error states are documented
- Prerequisites are clear
- Multiple learning styles supported

## Documentation Type Framework (Diátaxis)

Organize documentation into four distinct types - mixing them causes confusion:

### 1. Tutorials (Learning-Oriented)
**Purpose:** Help newcomers achieve early success and build confidence
**Characteristics:**
- Takes learner by the hand through a complete project
- Learning-oriented, not goal-oriented
- Shows one clear path (don't overwhelm with options)
- Validates success at each step with expected output
- Example: "Build your first React app" or "Django tutorial"

**Structure:**
```markdown
# Tutorial Title

## What You'll Build
[Show the end result]

## Prerequisites
[State clearly what's needed]

## Step 1: [Action]
[Clear instruction]
[Code example]
[Expected output]

## Step 2: [Next Action]
...

## What You Learned
[Recap key concepts]

## Next Steps
[Where to go from here]
```

### 2. How-To Guides (Task-Oriented)
**Purpose:** Solve specific problems for users who know basics
**Characteristics:**
- Goal-oriented practical steps
- Assumes foundational knowledge
- Multiple paths acceptable (show alternatives)
- Focuses on real-world scenarios
- Example: "How to configure authentication" or "How to deploy to production"

**Structure:**
```markdown
# How to [Accomplish Specific Task]

## Prerequisites
[Required knowledge/setup]

## Steps

### 1. [Action verb]
[Specific instruction]
[Code if needed]

### 2. [Next action]
...

## Verification
[How to confirm it worked]

## Troubleshooting
[Common issues and solutions]

## Related Guides
[Links to related tasks]
```

### 3. Reference (Information-Oriented)
**Purpose:** Provide accurate, complete technical specifications
**Characteristics:**
- Factual, consistent structure
- Comprehensive parameter documentation
- Describes the machinery accurately
- Minimal narrative - just the facts
- Example: "API Reference" or "Configuration options"

**Structure for APIs:**
```markdown
# [Method/Function Name]

[One-line description]

## Syntax
[Code signature with types]

## Parameters
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| param1 | string | Yes | - | What it does |
| param2 | number | No | 0 | What it does |

## Returns
[Type and description]

## Errors
| Code | Condition | Description |
|------|-----------|-------------|

## Examples

### Basic Usage
[Code example]
[Expected output]

### Advanced Usage
[Code example]
[Expected output]
```

### 4. Explanation (Understanding-Oriented)
**Purpose:** Clarify concepts, provide context, discuss alternatives
**Characteristics:**
- Conceptual understanding and enlightenment
- Discusses trade-offs and design decisions
- Provides broader context
- No need to be action-oriented
- Example: "Understanding async/await" or "Architecture overview"

**Structure:**
```markdown
# Understanding [Concept]

## Overview
[High-level explanation]

## Why This Matters
[Context and motivation]

## How It Works
[Conceptual explanation with diagrams]

## Design Decisions
[Rationale for approach]

## Trade-offs
[Advantages and disadvantages]

## Comparison with Alternatives
[When to use vs. other approaches]

## Further Reading
[Related explanations]
```

## Voice, Tone, and Style

### Writing Rules (Universal)

**Always:**
- ✓ Use second person ("you")
- ✓ Use active voice ("The API returns JSON")
- ✓ Use present tense ("The function processes data")
- ✓ Use imperative mood for instructions ("Click Submit")
- ✓ Use conversational but professional tone
- ✓ Define jargon when first introduced
- ✓ Include examples for every concept
- ✓ Show expected output

**Never:**
- ✗ Use passive voice unnecessarily ("JSON is returned")
- ✗ Use future tense for current features ("will return")
- ✗ Use first person plural ("we can configure")
- ✗ Use jargon without definition
- ✗ Write "wall of text" paragraphs
- ✗ Separate "why" from "how"
- ✗ Skip error documentation
- ✗ Assume prerequisites without stating them

### Code Comments Quality

**Bad - States the obvious:**
```javascript
i++; // increment i
const user = getUser(); // get the user
```

**Good - Explains reasoning:**
```javascript
// API requires explicit null to avoid nested table joins
// We aggregate extra data in the next query
const userInfo = await externalUserApi(userId, null);

// Process in batches to avoid memory exhaustion on large datasets
for (const batch of chunks(items, 1000)) {
  await processBatch(batch);
}
```

### Formatting Standards

| Element | Format | Example |
|---------|--------|---------|
| File names | `code font` | `config.json` |
| Function names | `code font` | `getUserData()` |
| Variables | `code font` | `userId` |
| UI elements | **Bold** | Click **Submit** |
| Emphasis | **Bold** | This is **important** |
| New terms | *Italics* first use | A *webhook* is... |
| Headings | Sentence case | Getting started guide |

## Content Organization Patterns

### README/Landing Page Structure
```markdown
# Project Title

[One-sentence description of what and why]

## Features
- Key feature 1
- Key feature 2
- Key feature 3

## Quick Start

[Minimal example that works immediately]

## Installation

[Step-by-step installation]

## Usage

### Basic Example
[Simple use case]

### Advanced Examples
[More complex scenarios]

## API Reference
[Link to detailed docs]

## Contributing
[How to contribute]

## License
[License information]
```

### API Documentation Structure
```markdown
# API Overview

[What it does, why it exists]

## Authentication

[How to authenticate]

## Quick Start

[First successful request in < 5 minutes]

## Core Concepts

[Key abstractions explained]

## API Reference

[Organized by resource/functionality, not alphabetically]

### Resource Type 1
#### Method 1
#### Method 2

### Resource Type 2
...

## Error Handling

[Common errors and solutions]

## Examples

[Real-world use cases]
```

### Heading Hierarchy Rules

```markdown
# Only One H1 (The Title)

## Major Sections (H2)

### Subsections (H3)

#### Sub-subsections (H4)
```

**Important:**
- Only one H1 per page
- Don't skip levels (no H2 → H4)
- Use sentence case
- Make scannable and descriptive

## Code Example Standards

### Every Code Example Must Include:

1. **Context** - What the code does and why
2. **Complete code** - Runnable or clearly marked otherwise
3. **Expected output** - What happens when it runs
4. **Error handling** - How to handle failures (when relevant)

### Example Template:

```markdown
### [Task Description]

[Brief context about what this accomplishes]

[Code example with syntax highlighting]

**Expected output:**
[Show what user should see]

**Common errors:**
- Error 1: Cause and solution
- Error 2: Cause and solution
```

### API Method Documentation Template:

```javascript
/**
 * [One-line description]
 *
 * [Detailed explanation of what it does and when to use it]
 *
 * @param {Type} paramName - Description (required/optional)
 * @param {Type} paramName2 - Description (default: value)
 * @returns {Type} Description of return value
 * @throws {ErrorType} When and why this error occurs
 *
 * @example
 * // Basic usage
 * const result = methodName(arg1, arg2);
 * console.log(result);
 * // Output: expected output here
 *
 * @example
 * // Advanced usage
 * const result = methodName(arg1, arg2, { option: true });
 * // Output: different output
 */
```

## Progressive Complexity Patterns

### Scaffold Learning:

**Level 1 - Minimal Example:**
```javascript
// Simplest possible usage
const result = api.get('/users');
```

**Level 2 - Practical Example:**
```javascript
// Real-world usage with error handling
try {
  const result = await api.get('/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  console.log(result.data);
} catch (error) {
  console.error('Failed to fetch users:', error.message);
}
```

**Level 3 - Production Example:**
```javascript
// Production-ready with retry logic and logging
const fetchUsers = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await api.get('/users', {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });
      logger.info('Successfully fetched users', { count: result.data.length });
      return result.data;
    } catch (error) {
      logger.warn(`Attempt ${i + 1} failed`, { error: error.message });
      if (i === retries - 1) throw error;
      await delay(1000 * Math.pow(2, i)); // Exponential backoff
    }
  }
};
```

**Pattern:**
- Start simple, add complexity progressively
- Mark advanced sections clearly
- Explain why additional complexity is needed

## Common Patterns from Exemplary Projects

### Two-Panel Layout (Stripe, Twilio pattern)
When writing web documentation, consider:
- Explanation/narrative on left
- Code examples on right
- Synchronized scrolling when possible

### Interactive Examples (React, Vue pattern)
- Provide "try it" links to sandboxes
- Make examples editable
- Show immediate results

### Progressive Disclosure (React pattern)
- "Quick answer" sections for experienced users
- "Deep dive" sections for those who want details
- Clear visual distinction between depths

### Multi-Language Support (Twilio, Vercel pattern)
- Show code in multiple languages
- Language selector at top
- Consistent examples across languages

### Difficulty Indicators (Slack pattern)
- Mark sections: beginner, intermediate, advanced
- Help users self-select appropriate content
- Prevent overwhelm and frustration

## Quality Checklist

Before publishing documentation, verify:

**Clarity:**
- [ ] Can a new user accomplish the task?
- [ ] Are prerequisites clearly stated?
- [ ] Is the value proposition clear upfront?

**Accuracy:**
- [ ] Is all information current and correct?
- [ ] Have you tested all code examples?
- [ ] Are parameter types and defaults accurate?

**Completeness:**
- [ ] Are all steps covered?
- [ ] Are error states documented?
- [ ] Are edge cases addressed?

**Examples:**
- [ ] Is there at least one working example?
- [ ] Is expected output shown?
- [ ] Are common use cases covered?

**Navigation:**
- [ ] Can users find related topics?
- [ ] Are there "next steps" suggestions?
- [ ] Is there a clear hierarchy?

**Accessibility:**
- [ ] Do images have alt text?
- [ ] Is there sufficient color contrast?
- [ ] Are headings properly nested?

**Consistency:**
- [ ] Is terminology consistent?
- [ ] Is formatting uniform?
- [ ] Is voice and tone consistent?

**Maintenance:**
- [ ] Is there a date or version indicator?
- [ ] Is there a way to report issues?
- [ ] Is outdated content removed?

## Anti-Patterns to Avoid

### Content Anti-Patterns:
1. **Abstract before concrete** - Show example first, explain after
2. **Alphabet soup organization** - Organize by use case, not alphabetically
3. **Missing prerequisites** - Always state what's needed
4. **Orphaned examples** - Every example needs context
5. **No error docs** - Document failure modes
6. **Inconsistent terminology** - Pick one term and stick with it

### Style Anti-Patterns:
1. **Wall of text** - Break into paragraphs and lists
2. **Passive voice overuse** - Use active voice
3. **Future tense** - Use present tense for current features
4. **Undefined jargon** - Define technical terms
5. **Obvious comments** - Explain "why," not "what"

### Structure Anti-Patterns:
1. **Skipped heading levels** - Don't jump from H2 to H4
2. **Multiple H1s** - Only one per page
3. **Poor hierarchy** - Information must be organized logically
4. **Missing table of contents** - Help users navigate

## Documentation Workflow

### When Writing New Documentation:

1. **Identify type** - Tutorial, how-to, reference, or explanation?
2. **Define audience** - What do they know? What do they need?
3. **State prerequisites** - What's required before starting?
4. **Start with example** - Show the end result first
5. **Build progressively** - Simple to complex
6. **Test everything** - Actually follow your own steps
7. **Get feedback** - Have someone else try it
8. **Iterate** - Improve based on questions and confusion

### When Updating Existing Documentation:

1. **Check accuracy** - Is it still correct?
2. **Test examples** - Do they still work?
3. **Update versions** - Note what's changed
4. **Remove outdated content** - Don't just mark it deprecated
5. **Check links** - Are they still valid?
6. **Update screenshots** - If UI has changed
7. **Maintain consistency** - Match existing style

## LLM-Specific Considerations

**IMPORTANT**: As an LLM generating documentation, you must actively counter systematic quality issues that plague AI-generated content. Research shows that even advanced models produce correct code only 65% of the time, with 40%+ containing security vulnerabilities.

### Critical: Avoid LLM Hallucinations

**Problem**: LLMs generate plausible-sounding but false information (19.7% package hallucination rate, 50%+ API failures).

**You MUST**:
- ✓ Only document APIs you are certain exist (use RAG/tool access when available)
- ✓ When uncertain, explicitly state "Verify this API exists in version X.Y"
- ✓ Never invent function parameters or method signatures
- ✓ State your knowledge cutoff limitations openly
- ✓ Recommend users verify against official documentation

**You MUST NOT**:
- ✗ Generate code using non-existent methods
- ✗ Fabricate package names or libraries
- ✗ Present uncertain information confidently
- ✗ Mix APIs from different versions without noting compatibility

**Example - Good approach**:
```python
# Using pandas DataFrame.merge() method
# Verify this matches your pandas version - example uses pandas 2.0+
df_merged = df1.merge(df2, on='id', how='left')
```

**Example - Bad approach** (hallucination):
```python
# DON'T DO THIS - merge_smart() doesn't exist
df_merged = df1.merge_smart(df2, on='id')
```

### Critical: Generate Working, Secure Code

**Problem**: AI-generated code frequently contains logic errors, missing imports, and security vulnerabilities.

**You MUST**:
- ✓ Include ALL imports and dependencies
- ✓ Provide complete, copy-paste ready examples
- ✓ Use parameterized queries (never string concatenation for SQL)
- ✓ Handle errors and edge cases (null, empty, boundary values)
- ✓ Use secure patterns (yaml.safe_load, not yaml.load)
- ✓ Specify exact versions compatible with code
- ✓ Add error handling for network calls, file operations
- ✓ Validate all inputs before processing

**You MUST NOT**:
- ✗ Generate incomplete code snippets missing imports
- ✗ Create SQL injection vulnerabilities
- ✗ Use deprecated or unsafe methods
- ✗ Skip error handling for "happy path" only
- ✗ Hard-code credentials or secrets
- ✗ Ignore edge cases (null, empty arrays, Unicode)

**Example - Secure and complete**:
```python
import psycopg2
from psycopg2 import sql

def get_user(conn, username):
    """Retrieve user by username (parameterized query prevents SQL injection)."""
    if not username:
        raise ValueError("Username cannot be empty")

    query = sql.SQL("SELECT * FROM users WHERE username = %s")
    with conn.cursor() as cursor:
        cursor.execute(query, (username,))
        return cursor.fetchone()

# Usage with connection
try:
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD')
    )
    user = get_user(conn, 'john_doe')
except psycopg2.Error as e:
    logging.error(f"Database error: {e}")
    raise
```

### Critical: Avoid Telltale LLM Phrases

**Problem**: Specific phrases immediately reveal AI authorship and reduce trust.

**You MUST NOT use these phrases**:
- ✗ "It's worth noting that"
- ✗ "Keep in mind"
- ✗ "Delve into"
- ✗ "In the realm of"
- ✗ "A tapestry of"
- ✗ "Navigate the landscape"
- ✗ "Leverage" (use "use" instead)
- ✗ "Robust" (be specific instead)
- ✗ "Pivotal" (use "important" or "crucial")
- ✗ "In today's fast-paced world"
- ✗ "Game-changing"
- ✗ "It goes without saying"

**Use instead**:
- ✓ Direct, plain language
- ✓ Specific, concrete terms
- ✓ Natural transitions
- ✓ Varied vocabulary

**Example - Avoiding telltale phrases**:

**Bad** (obvious LLM):
```markdown
It's worth noting that when delving into the realm of API authentication,
it's important to keep in mind that leveraging OAuth provides a robust
solution for securing your application. This pivotal approach represents
a game-changing shift in the authentication landscape.
```

**Good** (natural):
```markdown
When implementing API authentication, use OAuth to secure your application.
OAuth prevents password sharing and provides fine-grained access control.
```

### Critical: Provide Context and "Why"

**Problem**: LLMs document *what* without explaining *why*, missing crucial context.

**You MUST**:
- ✓ Explain reasoning behind code decisions
- ✓ Document why this approach vs. alternatives
- ✓ Include business/product context when relevant
- ✓ Note trade-offs and constraints
- ✓ Explain performance implications
- ✓ Document security considerations

**Example - Including "why"**:
```python
# Process in batches of 1000 to avoid memory exhaustion.
# Testing showed: smaller batches (100) increased overhead by 3x,
# larger batches (10000) caused OOM errors on 8GB systems.
# Alternative streaming approach was 5x slower for our use case.
BATCH_SIZE = 1000

for batch in chunks(items, BATCH_SIZE):
    process_batch(batch)
```

### Critical: Be Specific, Not Generic

**Problem**: LLMs regress to generic descriptions that could apply to anything.

**You MUST**:
- ✓ Use concrete numbers, dates, and measurements
- ✓ Provide specific examples from real scenarios
- ✓ Name actual technologies, tools, and versions
- ✓ Cite specific sources when referencing research
- ✓ Give precise error messages and solutions

**You MUST NOT**:
- ✗ "Significant improvements" → Specify: "reduced latency by 40ms"
- ✗ "Various aspects" → Name them: "authentication, logging, and caching"
- ✗ "Research shows" → Cite: "Smith et al. (2024) found..."
- ✗ "Best practices" → List them: "Use parameterized queries, validate inputs..."

### Critical: Production-Ready Examples

**Problem**: LLMs generate toy examples unsuitable for real-world use.

**You MUST**:
- ✓ Include error handling for network/file operations
- ✓ Show authentication and authorization
- ✓ Add logging for production debugging
- ✓ Handle rate limiting and retries
- ✓ Consider scale (millions of records, not 5)
- ✓ Use environment variables for configuration
- ✓ Show proper resource cleanup (connections, files)

**Example - Production-ready**:
```python
import logging
import os
import time
from typing import Optional

logger = logging.getLogger(__name__)

def fetch_user_data(
    user_id: int,
    max_retries: int = 3
) -> Optional[dict]:
    """
    Fetch user data with retry logic and proper error handling.

    Production considerations:
    - Exponential backoff prevents overwhelming the API
    - Timeout prevents hanging indefinitely
    - Logging enables debugging in production
    - Type hints improve code maintainability
    """
    url = f"{os.getenv('API_BASE_URL')}/users/{user_id}"
    headers = {'Authorization': f"Bearer {os.getenv('API_TOKEN')}"}

    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            logger.info(f"Successfully fetched user {user_id}")
            return response.json()

        except requests.exceptions.Timeout:
            logger.warning(f"Timeout fetching user {user_id}, attempt {attempt + 1}/{max_retries}")

        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching user {user_id}: {e}")

        if attempt < max_retries - 1:
            wait_time = 2 ** attempt  # Exponential backoff
            time.sleep(wait_time)

    logger.error(f"Failed to fetch user {user_id} after {max_retries} attempts")
    return None
```

### Critical: Maintain Consistent Terminology

**Problem**: LLMs use different terms for the same concept, creating confusion.

**You MUST**:
- ✓ Choose one term and use it consistently
- ✓ Define distinctions between similar terms upfront
- ✓ Create a terminology section if needed
- ✓ Use the project's established vocabulary

**Example**:
```markdown
## Terminology

This guide uses these terms consistently:

- **API Key**: Secret token for authenticating API requests (never use "access token" or "auth credential" interchangeably in this guide)
- **User**: Account holder with login credentials
- **Profile**: User's public information and preferences
```

### Critical: Avoid Over-Hedging

**Problem**: LLMs overuse qualifying language, making content tentative.

**Balance**:
- ✓ Use direct statements for established facts: "OAuth provides secure authentication"
- ✓ Hedge appropriately for uncertain claims: "This may improve performance depending on your use case"
- ✗ Don't hedge unnecessarily: "It could be argued that you might generally want to typically consider..."

### Self-Check Before Generating

Ask yourself:
1. **Hallucination check**: Am I certain these APIs/methods exist?
2. **Security check**: Is this code vulnerable to SQL injection, XSS, command injection?
3. **Completeness check**: Can a user copy-paste this and have it work?
4. **Error handling**: What happens with null, empty, or invalid inputs?
5. **Phrase check**: Am I using "delve," "leverage," "realm," or other telltale phrases?
6. **Context check**: Have I explained *why*, not just *what*?
7. **Specificity check**: Am I being concrete or generic?
8. **Version check**: Have I specified compatible versions?

---

## References

This skill is based on research documented in:
- `references/exemplary-projects.md` - Analysis of projects with exceptional documentation
- `references/best-practices.md` - Authoritative style guides and frameworks
- `references/llm-pitfalls.md` - LLM-specific quality issues and countermeasures

## Quick Decision Guide

**"What type of documentation should I write?"**
- User needs to learn basics → **Tutorial**
- User has specific task → **How-to guide**
- User needs to look up details → **Reference**
- User needs to understand concepts → **Explanation**

**"What tone should I use?"**
- Always: Conversational but professional
- Friendly without being frivolous
- Clear without being condescending

**"How much detail should I include?"**
- Start simple, add complexity progressively
- Mark advanced sections clearly
- Assume competency but verify prerequisites

**"How do I organize information?"**
- By user tasks, not by internal structure
- Most common use cases first
- Clear hierarchy with descriptive headings

**"How do I write good examples?"**
- Show context (what and why)
- Provide complete, runnable code
- Include expected output
- Handle errors when relevant
- Start simple, show advanced variations

---

## Applying This Skill

When writing documentation:
1. Choose the appropriate documentation type (Diátaxis)
2. Follow voice and tone guidelines (active, present, second person)
3. Use proven structural patterns from exemplary projects
4. Scaffold complexity progressively
5. **Apply LLM-specific countermeasures** (avoid hallucinations, telltale phrases, security issues)
6. Validate against the quality checklist
7. Test everything yourself before publishing

**CRITICAL - LLM Self-Checklist**:
- [ ] No hallucinated APIs or methods
- [ ] All code is complete, secure, and production-ready
- [ ] No telltale phrases ("delve," "leverage," "realm")
- [ ] Context and "why" explained, not just "what"
- [ ] Specific details, not generic descriptions
- [ ] Consistent terminology throughout
- [ ] Appropriate hedging (not over-qualified)

Remember: Great documentation shows respect for users' time, assumes competency while verifying prerequisites, and prioritizes practical examples over theoretical completeness. As an LLM, you must actively counter systematic quality issues through verification, specificity, and production-ready code examples.
