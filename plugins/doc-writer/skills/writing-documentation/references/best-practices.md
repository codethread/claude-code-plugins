# Documentation Best Practices & Guidelines

Synthesized from authoritative sources: Google Developer Documentation Style Guide, Diátaxis Framework, Write the Docs community, and Microsoft Writing Style Guide.

## Core Documentation Frameworks

### Diátaxis Framework
**Created by:** Daniele Procida (Canonical)
**Adopted by:** Python, Ubuntu, OpenStack, Gatsby, Cloudflare, and hundreds of other projects

**Four Interconnected Documentation Types:**

1. **Tutorials** (Learning-focused)
   - Teaches foundational concepts
   - Takes learner by the hand
   - Learning-oriented, not goal-oriented
   - Example: "Getting started with Python"

2. **How-To Guides** (Task-oriented)
   - Solves specific problems
   - Goal-oriented practical steps
   - Assumes some knowledge
   - Example: "How to configure authentication"

3. **Technical Reference** (Information-oriented)
   - Factual lookup documentation
   - Describes the machinery
   - Accurate and complete
   - Example: "API Reference"

4. **Explanation** (Understanding-oriented)
   - Conceptual understanding
   - Clarifies and enlightens
   - Provides context
   - Example: "Understanding async/await"

**Key Insight:** Mixing these types causes confusion. Keep them separate but linked.

---

## Voice and Tone (Universal Standards)

### Person, Voice, and Tense

| Element | Recommendation | Example |
|---------|----------------|---------|
| **Person** | Second person ("you") | "You can configure..." not "We can configure..." |
| **Voice** | Active voice | "The API returns JSON" not "JSON is returned" |
| **Tense** | Present tense | "The function processes..." not "will process..." |
| **Mood** | Imperative for instructions | "Click Submit" not "You should click Submit" |

**Why This Matters:**
- **Present tense:** Computers have no past/future; everything happens now
- **Active voice:** Clarifies who performs actions; easier to understand
- **Second person:** Directly addresses readers; increases engagement
- **Imperative:** More concise and direct for instructions

### Tone Characteristics

**Recommended:**
- Conversational but professional
- Friendly without being frivolous
- Warm and relaxed (Microsoft: "ready to lend a hand")
- Technically accurate without unnecessary jargon

**Avoid:**
- Overly casual language
- Humor that doesn't translate globally
- Marketing speak in technical docs
- Condescending or patronizing tone

---

## Content Organization

### Documentation Structure (Standard Pattern)

**For README/Landing Pages:**
1. **Title** (only one H1 heading)
2. **Brief description** (what and why)
3. **Installation/Setup**
4. **Quick Start** (get running in minutes)
5. **Usage examples**
6. **Features**
7. **API Reference** (or link to separate docs)
8. **Contributing/License**

**For API Documentation:**
1. **Overview** (what it does, why it exists)
2. **Authentication**
3. **Quick Start** (first successful request)
4. **Core Concepts** (key abstractions)
5. **API Reference** (endpoints, parameters, responses)
6. **Error Handling**
7. **Examples** (common use cases)

**For Tutorials:**
1. **Prerequisites** (what reader needs to know)
2. **Learning objectives** (what they'll accomplish)
3. **Step-by-step instructions**
4. **Expected output** (validate success)
5. **Next steps** (where to go from here)

### Heading Hierarchy

```markdown
# Project Title (ONLY ONE H1)

## Major Section (H2)

### Subsection (H3)

#### Sub-subsection (H4)
```

**Rules:**
- Only one H1 per page (the title)
- Don't skip heading levels (no H2 → H4)
- Use sentence case for headings
- Make headings descriptive and scannable

---

## Writing Style Guidelines

### Word Choice and Grammar

**Use:**
- Serial (Oxford) commas in lists
- Standard American spelling (if applicable)
- Descriptive link text ("See the installation guide" not "click here")
- Consistent terminology throughout
- Short, clear sentences
- Concrete examples

**Avoid:**
- Ambiguous pronouns (this, that, it without clear antecedent)
- Future tense for current features
- Passive voice when active is clearer
- Unnecessarily long words or phrases
- Jargon without definition

### Formatting Standards

**Code-related text:**
- Use `code font` for: file names, paths, variables, function names, commands
- Use **bold** for: UI elements users click, emphasis
- Use *italics* sparingly (mainly for introducing new terms)

**Lists:**
- **Numbered lists:** For sequential steps
- **Bulleted lists:** For non-sequential items
- **Description lists:** For term-definition pairs

---

## Code Examples and Documentation

### Essential Elements for Code Examples

1. **Context** - Explain what the code does and why
2. **Complete examples** - Code should be runnable (or clearly marked otherwise)
3. **Expected output** - Show what happens when code runs
4. **Comments** - Explain "why," not "what"
5. **Error handling** - Show how to handle failures

### Code Comment Quality

**Bad:** States the obvious
```javascript
i++; // increment i
const user = getUser(); // get the user
```

**Good:** Explains reasoning
```javascript
// API requires explicit null to avoid nested table joins
// We aggregate extra data in the next query
const userInfo = await externalUserApi(userId, null);
```

### API Documentation Standards

For every method/function, document:

**Parameters:**
- Name and description
- Data type
- Required vs. optional
- Default values
- Constraints (min/max, allowed values, format)

**Returns:**
- Return type
- Description of return value
- Possible return states

**Errors/Exceptions:**
- What errors can occur
- When they occur
- How to handle them

**Example:**
```javascript
/**
 * Calculates the sum of two numbers.
 *
 * @param {number} a - The first number (required)
 * @param {number} b - The second number (required)
 * @returns {number} The sum of a and b
 * @throws {TypeError} If either parameter is not a number
 *
 * @example
 * const result = sum(5, 3);
 * // Returns: 8
 *
 * @example
 * sum(5, "3"); // Throws TypeError
 */
function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Both parameters must be numbers');
  }
  return a + b;
}
```

---

## Audience Awareness

### Know Your Audience

**Key Questions:**
- What is their skill level?
- What are they trying to accomplish?
- What do they already know?
- What context do they need?

**Adaptations:**
- **Beginners:** More context, fewer assumptions, step-by-step guidance
- **Intermediate:** Less hand-holding, focus on patterns and best practices
- **Advanced:** Concise reference, edge cases, performance considerations

### State Prerequisites

Always specify what readers should know before starting:

**Good:**
```markdown
## Prerequisites

Before starting this tutorial, you should have:
- Basic familiarity with JavaScript
- Node.js 18+ installed
- Understanding of REST APIs
```

**Also Good (if none):**
```markdown
## Prerequisites

This guide assumes no prior knowledge. We'll cover everything from scratch.
```

### Serve Multiple Audiences

**Techniques:**
1. **Progressive disclosure:** Basic info first, "advanced" sections clearly marked
2. **Difficulty indicators:** Label sections (beginner/intermediate/advanced)
3. **Multiple pathways:** Quick start for experienced users, detailed tutorial for beginners
4. **Collapsible sections:** Advanced details hidden until needed
5. **"If you're new to X" sidebars:** Extra context for those who need it

---

## Accessibility and Inclusivity

### Inclusive Language

**Use:**
- Gender-neutral language
- "They/their" for singular when gender unknown
- Descriptive terms, not assumptions
- Globally understood examples

**Avoid:**
- Gendered pronouns when unnecessary
- Cultural references that don't translate
- Idioms and colloquialisms
- Ableist language ("sanity check" → "validation check")

### Visual Accessibility

**Images:**
- Always include descriptive alt text
- Use high-resolution or vector images
- Ensure sufficient color contrast
- Don't rely solely on color to convey information

**Structure:**
- Clear visual hierarchy
- Sufficient whitespace
- Readable font sizes
- Responsive design for mobile

---

## Maintenance and Lifecycle

### Documentation as Code

**Principles:**
1. **Version control:** Documentation lives in git with code
2. **Review process:** Documentation PRs reviewed like code
3. **CI/CD integration:** Test documentation builds
4. **Automated testing:** Check links, code examples, formatting

### Keeping Documentation Current

**Critical Rules:**
- Update documentation in same PR as code changes
- Mark deprecated features clearly
- Date time-sensitive content
- Remove outdated content (don't just mark it)
- Regular audits for accuracy

**Warning:** Outdated documentation is worse than no documentation.

---

## Actionable Quality Checklist

### Before Publishing Documentation

- [ ] **Clarity:** Can a new user accomplish the task?
- [ ] **Accuracy:** Is all information current and correct?
- [ ] **Completeness:** Are all steps and prerequisites covered?
- [ ] **Examples:** Are there working code examples?
- [ ] **Error handling:** Are failure modes documented?
- [ ] **Navigation:** Can users find related topics easily?
- [ ] **Accessibility:** Alt text, clear headings, good contrast?
- [ ] **Consistency:** Terminology and style consistent throughout?
- [ ] **Tested:** Have you actually followed the steps?
- [ ] **Feedback:** Is there a way to report issues?

### Common Quality Issues

**Structure:**
- Missing prerequisites
- Skipping heading levels
- Too many or too few headings
- Poor information architecture

**Content:**
- Outdated examples
- Missing error documentation
- Unclear parameter descriptions
- No expected output shown

**Style:**
- Passive voice overuse
- Inconsistent terminology
- Undefined jargon
- Walls of text without breaks

---

## Documentation Maturity Model

**Level 1 - Basic:**
- Exists but scattered
- May have outdated sections
- Grammar and formatting issues
- No clear organization

**Level 2 - Structured:**
- Organized with clear headings
- Consistent formatting
- Basic separation of concerns
- Regular updates

**Level 3 - Complete:**
- Tutorials, guides, reference, and explanations
- Multiple learning pathways
- Code examples tested
- Error documentation comprehensive

**Level 4 - Maintained:**
- Updated with code changes
- Audience-aware content
- Accessible and inclusive
- Feedback mechanisms active

**Level 5 - Excellent:**
- All above plus:
- Searchable and navigable
- Multiple formats (web, PDF, etc.)
- Interactive examples
- Analytics-driven improvements
- Community contributions welcomed

---

## Quick Reference: Style Decisions

| Aspect | Recommendation |
|--------|----------------|
| **Headings** | Sentence case |
| **Lists** | Serial comma |
| **Code** | Inline `backticks` |
| **UI elements** | **Bold** |
| **Links** | Descriptive text |
| **Person** | Second person ("you") |
| **Voice** | Active |
| **Tense** | Present |
| **Tone** | Conversational, professional |
| **Paragraphs** | Short (2-4 sentences) |
| **Examples** | Required for all APIs |

---

## Sources and Further Reading

- **Google Developer Documentation Style Guide:** https://developers.google.com/style
- **Diátaxis Framework:** https://diataxis.fr/
- **Write the Docs:** https://www.writethedocs.org/guide/
- **Microsoft Writing Style Guide:** https://learn.microsoft.com/en-us/style-guide/
