# Doc Writer Plugin

Write clear, effective technical documentation using industry-proven patterns and best practices, while actively countering common LLM documentation problems.

## Overview

The `doc-writer` plugin equips Claude Code with comprehensive documentation writing knowledge synthesized from:

- **Exemplary projects:** React, Rust, Django, Vue, Stripe, Twilio, Slack, Vercel
- **Authoritative style guides:** Google Developer Documentation Style Guide, Diátaxis Framework, Write the Docs, Microsoft Writing Style Guide
- **LLM research:** Systematic analysis of AI-generated documentation problems and countermeasures

**Unique feature**: This plugin includes specific guidance to counter systematic LLM documentation issues:
- Hallucinations (19.7% package rate, 50%+ API failures)
- Security vulnerabilities (40%+ in AI code)
- Telltale phrases that reveal AI authorship
- Missing context and "why" explanations
- Generic descriptions instead of specifics

Use this plugin when creating or improving READMEs, API documentation, tutorials, guides, or any technical documentation.

## Installation

```bash
/plugin install doc-writer@personal-configs-plugins
```

## What You Get

### Writing Documentation Skill

Load the comprehensive documentation writing skill:

```
/skill writing-documentation
```

Once loaded, Claude will apply best practices for:

- **Documentation structure** using the Diátaxis framework (tutorials, how-tos, reference, explanations)
- **Voice and tone** following universal standards (active voice, present tense, second person)
- **Code examples** with proper context, expected output, and error handling
- **Progressive complexity** scaffolding from simple to advanced
- **Quality patterns** from industry-leading projects
- **LLM-specific countermeasures** to avoid hallucinations, security issues, and telltale phrases

### What Gets Applied

When the skill is active, Claude will:

1. **Choose the right documentation type:**
   - Tutorials for learning-oriented content
   - How-to guides for task-oriented content
   - Reference for information lookup
   - Explanations for understanding concepts

2. **Follow proven writing patterns:**
   - Show examples before explaining abstractions
   - Use active voice and present tense
   - Structure content around user tasks
   - Include working code examples with expected output
   - Document error states and edge cases

3. **Apply quality standards:**
   - State prerequisites clearly
   - Provide progressive complexity (simple → advanced)
   - Use consistent terminology
   - Include visual hierarchy with proper headings
   - Make content scannable and accessible

4. **Counter LLM-specific issues:**
   - Verify APIs exist (no hallucinations)
   - Generate complete, secure code
   - Avoid telltale phrases ("delve," "leverage," "realm")
   - Provide context and "why" explanations
   - Use specific details, not generic descriptions

## Quick Start

### Writing a README

```
/skill writing-documentation

I need to write a README for my JavaScript library that validates email addresses.
```

Claude will create a README following best practices with:
- Clear title and description
- Installation instructions
- Quick start example
- Usage examples (basic → advanced)
- API reference
- Contributing guidelines

### Writing API Documentation

```
/skill writing-documentation

I need to document this API endpoint:
[paste your code]
```

Claude will create documentation with:
- Overview and authentication
- Endpoint reference with parameters
- Request/response examples
- Error documentation
- Common use cases

### Creating a Tutorial

```
/skill writing-documentation

I need a tutorial for building a REST API with Express.
```

Claude will create a step-by-step tutorial with:
- Clear learning objectives
- Prerequisites listed
- Progressive steps with expected output
- What you learned recap
- Next steps guidance

## Documentation Types (Diátaxis Framework)

The plugin uses the Diátaxis framework to organize documentation into four types:

| Type | Purpose | When to Use |
|------|---------|-------------|
| **Tutorial** | Learning-oriented | User needs to learn basics from scratch |
| **How-To Guide** | Task-oriented | User has specific problem to solve |
| **Reference** | Information-oriented | User needs to look up technical details |
| **Explanation** | Understanding-oriented | User needs conceptual understanding |

## Key Principles Applied

### Show, Then Explain
```javascript
// ✓ Good: Example first
const user = await api.getUser(123);

// Then explain:
// The getUser() method retrieves user data by ID...
```

### Active Voice and Present Tense
```markdown
✓ The API returns JSON data
✗ JSON data is returned by the API

✓ You configure authentication
✗ We can configure authentication
```

### Progressive Complexity
```javascript
// Level 1: Minimal
api.get('/users');

// Level 2: Practical
api.get('/users', { headers: { 'Authorization': token } });

// Level 3: Production-ready
// [Full implementation with retry logic and error handling]
```

### Complete Code Examples
Every example includes:
- Context (what and why)
- Complete, runnable code
- Expected output
- Error handling when relevant

## Examples

### Before Plugin
```markdown
# My API

This API does stuff.

## Usage
Call the endpoint.
```

### After Plugin
```markdown
# User Management API

A RESTful API for managing user accounts with authentication, role-based access control, and audit logging.

## Quick Start

```javascript
const api = require('@mycompany/user-api');

// Fetch a user by ID
const user = await api.users.get(123);
console.log(user);
// Output: { id: 123, name: "John Doe", email: "john@example.com" }
```

## Installation

```bash
npm install @mycompany/user-api
```

## Authentication

[Clear authentication documentation...]

## API Reference

### `users.get(id)`

Retrieves a user by their unique identifier.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | number | Yes | User's unique identifier |

**Returns:** `Promise<User>`

**Errors:**
| Code | Condition | Description |
|------|-----------|-------------|
| 404 | User not found | No user exists with provided ID |
| 401 | Unauthorized | Invalid or missing authentication token |

[More examples...]
```

## Research Foundation

The skill is based on extensive research documented in:

- **`references/exemplary-projects.md`** - Analysis of 8 projects known for excellent docs (React, Rust, Stripe, Twilio, etc.)
- **`references/best-practices.md`** - Synthesis of authoritative style guides (Google, Diátaxis, Write the Docs, Microsoft)
- **`references/llm-pitfalls.md`** - Comprehensive analysis of LLM documentation problems and countermeasures

These references inform the patterns, structures, and principles applied when writing documentation, including specific guidance to counter systematic LLM quality issues.

## Quality Checklist

When the skill is active, Claude validates documentation against:

**Standard Quality**:
- **Clarity:** Can users accomplish tasks independently?
- **Accuracy:** Is all information current and tested?
- **Completeness:** Are prerequisites, steps, and errors covered?
- **Examples:** Are there working code examples with output?
- **Navigation:** Can users find related topics?
- **Accessibility:** Proper headings, alt text, contrast?
- **Consistency:** Uniform terminology and formatting?

**LLM-Specific Quality**:
- **No hallucinations:** All APIs/methods verified to exist
- **Security:** No SQL injection, XSS, or other vulnerabilities
- **Completeness:** All imports, dependencies, error handling included
- **Natural language:** No telltale LLM phrases
- **Context:** "Why" explained, not just "what"
- **Specificity:** Concrete details, not generic descriptions
- **Production-ready:** Real-world examples with auth, logging, retries

## Use Cases

### Creating New Documentation
- Writing READMEs for open source projects
- Creating API documentation
- Building tutorial series
- Writing onboarding guides

### Improving Existing Documentation
- Restructuring unclear documentation
- Adding missing examples
- Improving code sample quality
- Organizing content with Diátaxis

### Specific Documentation Types
- REST API documentation
- CLI tool documentation
- Library/framework documentation
- Configuration guides
- Troubleshooting guides

## Tips for Best Results

1. **Be specific about documentation type:**
   ```
   I need a tutorial (not a how-to guide) for...
   ```

2. **Provide context:**
   ```
   I'm writing docs for junior developers who are new to REST APIs
   ```

3. **Share existing code:**
   ```
   Here's my API code - please document it:
   [paste code]
   ```

4. **Request specific patterns:**
   ```
   Use the two-panel layout pattern like Stripe
   ```

5. **Iterate:**
   ```
   This is too advanced - make it more beginner-friendly
   ```

## Related Plugins

- **spec-dev:** For writing technical specifications and requirements documents
- **skill-creator:** For creating Claude Code skills (which include documentation)

## Feedback and Contributions

Found an issue or have a suggestion? The plugin is maintained as part of the personal-configs-plugins marketplace.

## License

Part of the personal-configs-plugins marketplace. See repository root for license information.
