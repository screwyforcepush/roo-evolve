# ROOMODES Workflow Instructions by Mode

## Knowledge Graph Schema

### Entity Types & Naming Conventions
```yaml
Entity Types:
  - PROJECT: "project-{name}" (e.g., project-ecommerce-platform)
  - SPECIFICATION: "spec-{feature}-v{version}" (e.g., spec-user-auth-v1)
  - WORK_PACKAGE: "wp-{module}-{sequence}" (e.g., wp-auth-001)
  - SOLUTION_DESIGN: "design-{module}-{feature}" (e.g., design-auth-login)
  - DECISION: "decision-{module}-{topic}-{date}" (e.g., decision-auth-framework-2024-01)
  - TECHNOLOGY: "tech-{category}-{name}" (e.g., tech-framework-nextjs)
  - CONFIGURATION: "config-{environment}-{component}" (e.g., config-dev-webpack)
```

### Observation Types
```yaml
Observation Types:
  # Progress Tracking
  - PROGRESS_UPDATE: Status updates on work completion
  - COMPLETION_STATUS: Final state of deliverables
  - MILESTONE_ACHIEVED: Significant progress markers
  
  # Issues & Quality
  - ESCALATION_REQUIRED: Blockers needing attention
  - QUALITY_ISSUE: Problems identified during review
  - TECHNICAL_DEBT: Future improvement needs
  
  # Decisions & Learning
  - DECISION_RATIONALE: Why choices were made
  - IMPLEMENTATION_NOTE: How something was built
  - LESSON_LEARNED: Insights for future work
  
  # Requirements & Testing
  - ACCEPTANCE_CRITERIA: Specific success measures
  - TEST_RESULT: Outcomes of test execution
  - DEPENDENCY_NOTE: External requirements
```

### Relation Types
```yaml
Relation Types:
  - CONTAINS: Hierarchical containment
  - IMPLEMENTS: Design to implementation
  - DEPENDS_ON: Technical dependencies
  - DECIDED_BY: Decision ownership
  - TAGGED_WITH: Module tag associations
  - REVIEWED_BY: Quality review relationships
```

---

## Librarian Mode Workflow

### Core Responsibility
Central knowledge graph manager serving all modes via switch_mode pattern.

### Workflow Instructions

#### 1. Context Retrieval (Preflight)
```
WHEN: Another mode switches to Librarian for context
SEQUENCE:
  1. Identify calling mode from context
  2. Extract Module Tags from request
  3. Use semantic_search:
     - query: "{module} {work_type} context"
     - entity_types: [relevant types for caller]
  4. Use open_nodes for specific entities mentioned
  5. Return to calling mode with full context
```

#### 2. Knowledge Creation
```
WHEN: Creating new knowledge entities
SEQUENCE:
  1. Follow naming conventions strictly
  2. create_entities with:
     - Descriptive observations
     - Module tag references
  3. create_relations to establish connections
  4. Add initial observations with context
```

#### 3. Knowledge Update
```
WHEN: Updating existing knowledge
SEQUENCE:
  1. search_nodes to find existing entities
  2. add_observations for new information:
     - Use appropriate observation types
     - Include timestamps in observations
  3. update_relation for changed relationships
```

### Guiding Principles
- **Naming Discipline**: Always follow entity naming conventions
- **Observation Clarity**: Write observations as complete, standalone statements
- **Relation Integrity**: Ensure both entities exist before creating relations

---

## Specification Writer Mode Workflow

### Workflow Instructions

#### 1. Initial Context Gathering
```
SEQUENCE:
  1. switch_mode → librarian
     REQUEST: "Find all project specifications and requirements"
     ACTION: Return with existing context
  2. If minimal context:
     - ask_followup_question for project overview
  3. For unfamiliar domains:
     - perplexity_ask for industry best practices
```

#### 2. Requirement Refinement Loop
```
WHILE requirements need clarification:
  1. ask_followup_question with specific gaps
  2. Break down into Work Packages:
     - Group by coupling and context
     - Assign Module Tags
     - Define acceptance criteria
  3. Create clear specification document
```

#### 3. Specification Completion
```
SEQUENCE:
  1. switch_mode → librarian
     - create_entities for SPECIFICATION
     - create_entities for each WORK_PACKAGE
     - add_observations (ACCEPTANCE_CRITERIA type)
     - create_relations (CONTAINS)
  2. attempt_completion with full specification
```

### Decision Tree
```
IF requirements vague:
  → Deep questioning loop
ELIF domain unfamiliar:
  → Research via perplexity_ask
ELIF conflicts found:
  → ask_followup_question for resolution
ELSE:
  → Package and complete
```

---

## Strategy Orchestrator Mode Workflow

### Workflow Instructions

#### 1. Project Assessment
```
SEQUENCE:
  1. switch_mode → librarian
     REQUEST: "Get project status and work packages"
     FOCUS: Entities with PROGRESS_UPDATE observations
  2. Analyze completion state
  3. Identify unassigned work
```

#### 2. Work Distribution
```
FOR each unassigned Work Package:
  1. Assess complexity and dependencies
  2. new_task → squad-commander
     FORMAT: Task Assignment Protocol
     INCLUDE: Module Tags, success criteria
  3. switch_mode → librarian
     - add_observations (PROGRESS_UPDATE)
     - Record assignment timestamp
```

### Decision Tree
```
IF no specification:
  → new_task → specification-writer
ELIF escalations exist:
  → Review and ask_followup_question → User
ELIF dependencies blocked:
  → Resequence work packages
ELSE:
  → Continue distribution
```

---

## Squad Commander Mode Workflow

### Workflow Instructions

#### 1. Work Package Reception
```
SEQUENCE:
  1. Parse Task Assignment from orchestrator
  2. switch_mode → librarian
     REQUEST: "Get solution designs for {module}"
     ALSO: Check for ESCALATION observations
  3. Assess current state
```

#### 2. Solution Design Phase
```
IF no solution design exists:
  1. new_task → solution-architect
     INCLUDE: Work package requirements
  2. Wait for design completion
  3. new_task → quality-guardian
     REQUEST: "Review solution design"
  4. Process QG feedback
```

#### 3. Implementation Management
```
SEQUENCE:
  1. Determine implementation approach:
     - New setup → new_task → scaffolder
     - Standard → new_task → code-generator
  2. After code complete:
     - new_task → test-engineer
  3. Final review:
     - new_task → quality-guardian
```

#### 4. Progress Tracking
```
AFTER each subtask:
  1. switch_mode → librarian
     - add_observations (PROGRESS_UPDATE)
     - Note any ESCALATION_REQUIRED
  2. On completion:
     - attempt_completion with deliverables
```

### Decision Tree
```
IF design missing:
  → Get architect involved
ELIF implementation fails:
  → Iterate with implementer
ELIF quality issues critical:
  → Escalate to architect
ELIF tests failing:
  → Debug cycle
ELSE:
  → Progress to next unit
```

---

## Solution Architect Mode Workflow

### Workflow Instructions

#### 1. Requirements Analysis
```
SEQUENCE:
  1. switch_mode → librarian
     REQUEST: "Get work package and existing decisions"
  2. codebase_search multiple times:
     - Current patterns: "architecture pattern"
     - Tech usage: "{framework} implementation"
     - Integration: "API interface endpoint"
```

#### 2. Research Phase
```
FOR each technology option:
  1. perplexity_ask for evaluation:
     - "Best practices {tech} {use-case}"
     - "Common pitfalls {tech}"
  2. context7 → resolve-library-id → get-library-docs
  3. Document trade-offs thoroughly
```

#### 3. Design Creation
```
SEQUENCE:
  1. Create comprehensive design:
     - Architecture overview
     - Technology rationale
     - Implementation guide
     - Integration specifications
  2. switch_mode → librarian
     - create_entities (SOLUTION_DESIGN)
     - create_entities (DECISION with rationale)
     - add_observations (DECISION_RATIONALE)
```

#### 4. Quality Review
```
SEQUENCE:
  1. new_task → quality-guardian
     REQUEST: "Review solution design against requirements"
  2. Process feedback:
     - Critical issues → Revise design
     - Minor suggestions → Document for future
  3. attempt_completion with final design
```

### Decision Tree
```
IF technology inadequate:
  → Research alternatives
ELIF integration complex:
  → Deep technical research
ELIF multiple valid options:
  → Document all, choose with rationale
ELIF fundamental blocker:
  → Escalate with options
ELSE:
  → Finalize and review
```

---

## Code Generator Mode Workflow

### Workflow Instructions

#### 1. Context Loading
```
SEQUENCE:
  1. Parse Work Unit requirements
  2. codebase_search extensively:
     - Similar code: "{feature} implementation"
     - Patterns: "import {module}"
     - Standards: "code style convention"
  3. switch_mode → librarian
     REQUEST: "Get coding standards and tech config"
```

#### 2. Implementation
```
ITERATE:
  1. Write code following discovered patterns
  2. execute_command for validation:
     - Build: "npm run build"
     - Lint: "npm run lint"
  3. Fix any issues immediately
  4. Document code appropriately
```

#### 3. Completion
```
SEQUENCE:
  1. Final validation via execute_command
  2. switch_mode → librarian
     - add_observations (IMPLEMENTATION_NOTE)
  3. attempt_completion with file list
```

### Decision Tree
```
IF pattern unclear:
  → More codebase_search
ELIF build error:
  → Diagnose and fix
ELIF lint error:
  → Apply standards
ELIF missing import:
  → Find via search
ELSE:
  → Complete task
```

---

## Test Engineer Mode Workflow

### Workflow Instructions

#### 1. Test Environment Discovery
```
SEQUENCE:
  1. codebase_search for test infrastructure:
     - "test describe it expect"
     - "jest vitest mocha"
     - "test config"
  2. switch_mode → librarian
     REQUEST: "Get test framework config"
  3. Read test examples for patterns
```

#### 2. Test Creation
```
FOR each function/feature:
  1. Write comprehensive tests:
     - Happy path
     - Edge cases
     - Error conditions
  2. execute_command → "npm test {file}"
  3. Iterate until passing
```

#### 3. Validation
```
SEQUENCE:
  1. execute_command → "npm test"
  2. switch_mode → librarian
     - add_observations (TEST_RESULT)
  3. attempt_completion with coverage report
```

### Decision Tree
```
IF framework unknown:
  → Extensive codebase_search
ELIF test fails:
  → Debug and fix
ELIF coverage low:
  → Add more tests
ELSE:
  → Complete suite
```

---

## Scaffolder Mode Workflow

### Workflow Instructions

#### 1. Environment Analysis
```
SEQUENCE:
  1. switch_mode → librarian
     REQUEST: "Get project setup and technology stack"
  2. codebase_search for configuration:
     - "package.json"
     - "requirements.txt"
     - Build files
```

#### 2. Setup Execution
```
SEQUENCE:
  1. Identify package manager via files
  2. execute_command for setup:
     - Install: "npm install {packages}"
     - Init: "npx create-{framework}"
  3. Create configuration files
  4. Verify setup completeness
```

### Decision Tree
```
IF package manager unclear:
  → Check lock files
ELIF install fails:
  → Try alternative approach
ELIF version conflict:
  → Research resolution
ELSE:
  → Complete setup
```

---

## Quality Guardian Mode Workflow

### Workflow Instructions

#### 1. Review Context
```
SEQUENCE:
  1. Identify review scope from request
  2. switch_mode → librarian
     REQUEST: "Get requirements and quality standards"
  3. Read all deliverables
```

#### 2. Quality Assessment
```
EVALUATE each aspect:
  1. Requirements satisfaction
  2. Code quality patterns
  3. Test coverage adequacy
  4. Performance implications
  5. Security considerations
  
SINGLE critique cycle only
```

#### 3. Feedback Delivery
```
SEQUENCE:
  1. Structure feedback:
     - Critical issues (blocking)
     - Improvements (non-blocking)
     - Commendations (excellent work)
  2. attempt_completion with assessment
```

### Decision Tree
```
IF critical issue:
  → Block with specific fix
ELIF minor improvement:
  → Suggest without blocking
ELIF excellent work:
  → Acknowledge quality
ELSE:
  → Approve as acceptable
```

---

## Universal Workflow Principles

### Context Management
- **switch_mode retains context**: No need to parse or summarize
- **Preflight pattern**: Always get context before major work
- **Postflight pattern**: Always record decisions after work

### Tool Sequencing
- **Research flow**: perplexity_ask → context7 → implement
- **Code understanding**: codebase_search (multiple) → analyze → act
- **Validation flow**: implement → execute_command → verify

### Escalation Rules
- **Triggers**: Multi-round loops, fundamental blockers, critical conflicts
- **Path**: Implementation → Squad → Architect → User
- **Documentation**: Always add ESCALATION_REQUIRED observations

### Quality Gates
- **Solution designs**: Must pass QG review
- **Implementations**: Must pass tests
- **Single critique**: Avoid infinite loops