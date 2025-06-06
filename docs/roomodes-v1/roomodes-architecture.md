# ROOMODES: Autonomous Engineering System Architecture

## Introduction & Objective

This document outlines the organizational structure and communication protocols for **ROOMODES** - a state-of-the-art autonomous engineering system built on Roo Code's multi-mode architecture. The primary objective is to create a sophisticated agent-based development environment that can autonomously handle complex software engineering projects from specification through implementation.

### Core Philosophy

The system is designed around several key principles:

- **Context Isolation**: Each agent mode maintains focused, relevant context without pollution from unrelated discussions
- **Decision Traceability**: Every architectural and technical choice is captured with rationale in a knowledge graph
- **Minimal Handoff Loss**: Structured communication protocols ensure essential information transfers between modes
- **Knowledge Centralization**: A Librarian agent serves as the knowledge bus, managing project context and decisions
- **Quality Assurance**: Built-in review cycles prevent defects without creating infinite critique loops

### Technical Context

**Platform**: Roo Code VS Code extension with custom modes and MCP (Model Context Protocol) integration
**Knowledge Management**: Existing Memento-based knowledge graph for decision-centric project memory
**Communication Pattern**: `switch_mode` to Librarian for knowledge operations, preserving calling context
**Automation Level**: Full auto-approval expected for autonomous operation
**Constraint Management**: Working within Roo Code's subtask isolation and context window limitations

### System Architecture Overview

The system operates across three primary layers:
1. **Strategic Layer**: Project vision, requirements, and resource allocation
2. **Squad Layer**: Technical design and work coordination  
3. **Implementation Layer**: Code generation, testing, and delivery

A **Quality Guardian** provides cross-cutting quality assurance, while the **Librarian** serves as the central knowledge repository accessible via mode switching patterns.

---

# ROOMODES Organizational Structure

## Context Isolation Benefits
- **Specification Writer**: Prevents requirement chatter from polluting strategic context
- **Squad Commander**: Receives clean design outputs, not architecture deliberation
- **Solution Architect**: Focuses on technical decisions without implementation details
- **Implementation Layer**: Works with clear specifications without strategic noise

## Success Metrics
- **Reduced Context Pollution**: Each mode maintains focused, relevant context
- **Decision Traceability**: Every architectural choice captured with rationale
- **Efficient Handoffs**: Minimal context loss between mode transitions
- **Quality Assurance**: Built-in review cycles without infinite loops
- **Knowledge Persistence**: Decisions and rationale survive across sessions

## Strategic Layer
```
User ↔ 📋 Specification Writer ↔ 🔭 Strategy Orchestrator
```

### 📋 Specification Writer
**Role**: Interactive requirements refinement and decomposition
- Engages in back-and-forth dialogue with User
- Breaks down complex requirements into shippable work packages
- Creates detailed acceptance criteria
- **Isolation Benefit**: Prevents spec refinement chatter from polluting Strategy Orchestrator context
- **Activation**: On-demand when Strategy Orchestrator needs requirement decomposition
- **Output**: Signed-off specification document to Strategy Orchestrator

### 🔭 Strategy Orchestrator  
**Role**: Project vision and resource allocation
- Accepts complete specifications from User OR refined specs from Specification Writer
- Evaluates project complexity and prioritization
- Allocates work packages with Module Tags to Squad Commanders.
- Tracks high-level completion metrics
- **Knowledge Pattern**: Preflight knowledge retrieval via Librarian switch_mode

## Squad Layer
```
Strategy Orchestrator → 👑 Squad Commander ↔ 🏗️ Solution Architect ↔ 🔍 Quality Guardian
```

**Ephemeral Squad Concept**: Squads exist only long enough to complete a Work Package. They are infinitely flexible and created with appropriate Module Tags for the work. Cross-module integration (e.g., auth + payments) creates new squads with both tag sets.

### 👑 Squad Commander
**Role**: Work coordination and progress management. Leads the cross-functional team.
- Receives work package from Strategy Orchestrator
- Coordinates implementation sequencing
- **Isolation Benefit**: Only receives final solution design, not architecture deliberation context
- Manages handoffs to Implementation Layer
- Reports progress summaries upward

### 🏗️ Solution Architect
**Role**: Technical design and architecture decisions
- Creates technical architecture and design documents
- Makes technology selection decisions (final decision authority for Solution Design)
- Plans infrastructure and integration needs
- **Research Tools**: Uses `perplexity_ask` and other research agents for deep technical investigation
- **Knowledge Pattern**: Postflight decision capture via Librarian switch_mode
- **Escalation**: Multi-round loops or fundamental infeasibility escalate to User

## Implementation Layer
```
Squad Commander → (🧰 Scaffolder? → 💻 Code Generator ↔ 🧪 Test Engineer) ↔ 🔍 Quality Guardian
```

### 🧰 Scaffolder *(On-Demand)*
**Role**: DevOps and project setup specialist
- Researches and installs libraries/dependencies
- Creates project structures and CI/CD pipelines
- Configures build systems and deployment
- **Activation**: When new project setup or major dependency changes needed

### 💻 Code Generator
**Role**: Core implementation development
- Writes application code following design specifications
- Implements business logic and interfaces
- Documents code and maintains quality standards
- **Primary implementer** - handles library installation when Scaffolder not needed

### 🧪 Test Engineer
**Role**: Quality validation and verification
- Creates and executes test suites
- Validates against requirements and acceptance criteria
- Identifies edge cases and integration issues
- Reports findings to Squad Commander

## Knowledge Infrastructure
```
📖 Librarian ↔ All Modes (via switch_mode pattern)
```

### 📖 Librarian
**Role**: Knowledge graph manager and context provider
- **Switch Mode Pattern**: Other modes switch to Librarian for knowledge ops, then switch back
- Manages decision-centric knowledge graph (existing Memento implementation)
- Provides preflight context retrieval
- Captures postflight decision updates
- Maintains project history and architectural rationale
- **Multi-Tag Support**: Knowledge entities can have multiple Module Tags, updated over time
- **Organic Tag Evolution**: Tag hierarchy evolves naturally as project complexity grows
- **Cross-Module Knowledge**: Decisions and context can span multiple modules when tagged appropriately

## Reflect and Critique feedback loop
```
🔍 Quality Guardian ↔ Architect and Implementation
```

### 🔍 Quality Guardian
**Role**: Design and implementation quality assurance
- Evaluates Architect solution designs against Module within Specification Document Scope
- Reviews implementation code and tests against Task within Solution Design Scope
- Critiques poor implementation quality (functional but not well-implemented)
- Provides critique and improvement recommendations
- **Anti-Loop Design**: Single critique cycle, then escalate to Squad Commander for accept/refine decision
- **Quality Escalation**: Poor implementation escalates to Squad Leader for architect advise, patch, or documentation in `potential-refinements.md`

# Communication Flow Patterns

### 1. User → Strategic Layer
```
User Request → [Specification Writer] → Strategy Orchestrator
```
- **Direct Path**: User provides complete spec with Module breakdown to Strategy Orchestrator
- **Refinement Path**: Strategy Orchestrator delegates to Specification Writer for Module breakdown

### 2. Strategic → Squad Layer  
```
Strategy Orchestrator → Squad Commander → Solution Architect
```
- Work Module assignment with clear scope and constraints
- Architecture development and decision capture
- Implementation 

### 3. Squad → Implementation Layer
```
Solution Architect → Squad Commander → [Scaffolder] → Code Generator ↔ Test Engineer
```
- Design handoff to implementation
- Optional scaffolding for complex setups
- Code-test iteration cycle

### Knowledge Integration Pattern
```
Any Mode → switch_mode(librarian) → Knowledge Operation → switch_mode(original_mode)
```
- **Preflight**: Retrieve relevant context before major decisions
- **Postflight**: Capture decisions and rationale after completion
- **Maintains**: Original mode context while enabling knowledge operations

### Reflect Integration Pattern
```
Squad or Implement layer ready for review → new_task(quality_guardian) → Review requirements, and Critique deliverable → attempt_completion()
```
- **Review Requirements**: Retrieve relevant context, read documents to get understanding of scope at a higher level
- **Critique**: Assess and score the deliverable, providing refinement suggestions only if acceptance criteria is not met, or if critical to fit within the big picture. 
- **Used before attempt_completion**
  - Specification Writer: Researches current state of project for accurate (functional only no code) specification of job to be done
  - Architct: Assess solution design within wider specification big picture
  - Tester/Coder: Reviews Work Unit implementation meets acceptance criteria, and all tests run green.
  - Squad Leader: Reviews Work Package implementation meets acceptance criteria, and all tests run green. 
  - Squad Commander: Reviews full implementation to specification, meets acceptance criteria, and all tests run green.  

### Failure Cascade Management
**Implementation Technical Failures:**
- When implementation discovers technology doesn't work in practice → escalate to Architect
- Architect uses research tools (`perplexity_ask` web search agent) to deep dive into tech docs, examples, forums
- If technology fundamentally flawed → Architect makes new technology decision
- If implementation works but poorly → escalate to Squad Leader → options: architect advise, patch, or document in `potential-refinements.md`

**Architect Design Failures:**
- Multi-round architect loops or core infeasibility → escalate to User
- Critical conflicts or fundamental approach flaws → escalate to User

**Sequential Work Pattern:**
- All work is sequential, no parallelism
- When spec changes mid-implementation: pause all work → patch specification → repackage remaining work → continue

**Escalation Circuit Breakers:**
- Strategy Orchestrator, Squad Leader, or Architect can escalate to User for multi-round loops, critical conflicts, or core infeasibility

# Intermode Communication Protocol

## Task Assignment Protocol (Receiver-Centric Design)

### Task Message Format
```markdown
# TASK: {project}-{module}-{sequence} | {brief_description}

## OBJECTIVE
{what_you_need_to_accomplish}

## PROBLEM
{what_specific_issue_you're_solving}

## SUCCESS CRITERIA
- [ ] {measurable_outcome_1}
- [ ] {measurable_outcome_2}
- [ ] {measurable_outcome_3}

## REQUIREMENTS
{specific_constraints_or_must-haves_for_this_task}

## CONTEXT
{strategic_importance_and_how_it_fits_the_bigger_picture}

## DETAIL
{significant_implementation_specifics_when_needed}
{code_snippets, file_instructions, technical_specifications}
```

### Completion Response Format
```markdown
# COMPLETION: {task_id}
**STATUS:** {complete|escalate|failed}

## DELIVERABLES
{what_you_created_and_where_to_find_it}

## DECISIONS MADE
{key_choices_with_brief_rationale}

## ESCALATIONS
{anything_that_needs_higher_level_attention}
```

### Protocol Design Principles
- **Receiver Autonomy**: Receivers can get their own context via Librarian switch_mode
- **Self-Service Knowledge**: Tags and knowledge keys retrieved independently 
- **Built-in Authority**: Decision authority coded into mode definitions
- **Minimal Payload**: Focus on objective, problem, success criteria
- **Strategic Context**: Just enough context for importance understanding
- **Flexible Detail**: Allow for significant implementation specifics when needed

# Glossary

## Project
- The entire codebase/repo
- Can be blank slate or existing state at the time of strategic layer engagement
- Has a north star, strategic purpose, high level objective, global tech decisions.
- Strategic layer focuses on this level.

## Specification
- Can be for a project, a feature, a bug, or change request.
- Must be defined within the context of Project
- Strategic layer focuses on this documentation.
- What the system should do and why.

## Work Package
- A shippable feature, unit of value.
- Work is thoughtfully grouped into one or more packages based on coupling, in order to optimise shared context.
- There is a very high overlap of need-to-know context between work units, within a single work package.
- Has one or more Module Tags
- Initially packaged by Spec Writer. Can be adjusted by Strategy Orchestrator as implementation progresses and new information arrises.
- Executed on by Squad

## Solution Design
- Reserached and project context aware solution.
- Highly prescriptive, with technical documentation, reference implementation, project structure, file references.
- How the solution achieves the work package specified.
- Specific e2e test for work package acceptance.
- Unit level test tags for work unit acceptance.
- Architect is decision authority

## Work Unit
- Initially defined by Architect within implementation plan items, can be adjusted by Squad leader as new information arrises.
- Implementation + test suite.

## Module Tags
- Describes functional focus area of the work package. eg. payments, auth, dashboard, etc.
- Can be multiple for a given package and knowledge entities
- **Organic Evolution**: Tag hierarchy evolves naturally as project grows (e.g., "payments" → "payments-stripe", "payments-paypal")
- Used for knowledge lookup and storage with cross-module bleeding controlled via multi-tagging
- Included when work package is assigned to squad, and a subset included when work unit is assigned to implementation layer
- **Cross-Module Integration**: New squads created with combined tag sets for integration work