# Solution Design: Evaluation Metrics & Report Generation

## Overview
Implementation of evaluation pipeline with schema validation, metrics computation, and report generation via Handlebars.

## Architecture
The system consists of the following components:
- Schema validation ([`schema/timeline.json`](schema/timeline.json:1))
- Validation module ([`src/eval/validation.ts`](src/eval/validation.ts:1))
- Metrics module ([`src/eval/metrics.ts`](src/eval/metrics.ts:1))
- Template file ([`src/eval/template.hbs`](src/eval/template.hbs:1))
- Report generator ([`src/eval/report.ts`](src/eval/report.ts:1))
- CI integration via npm script ([`package.json`](package.json:1))

## Technology Decisions
### JSON Schema Validator
- Options: AJV, Joi, Zod  
- Selected: AJV  
- Rationale: Lightweight, full JSON Schema support, reliable TypeScript typings

### Template Engine
- Options: Handlebars, Mustache, EJS  
- Selected: Handlebars  
- Rationale: Simple syntax, helper support, widespread usage

### Date Handling
- Options: date-fns, Moment.js, native Date  
- Selected: date-fns  
- Rationale: Modular imports, immutable API, small bundle size

### Reporting Format
- Markdown via Handlebars templates for readability in CI artifacts

## Implementation Guide

### File Structure
```
├─ [`schema/timeline.json`](schema/timeline.json:1)
├─ src/eval/
│  ├─ [`validation.ts`](src/eval/validation.ts:1)
│  ├─ [`metrics.ts`](src/eval/metrics.ts:1)
│  ├─ [`template.hbs`](src/eval/template.hbs:1)
│  └─ [`report.ts`](src/eval/report.ts:1)
├─ [`package.json`](package.json:1)
└─ reports/
   └─ [`eval-report.md`](reports/eval-report.md:1)
```

### JSON Schema Definition (`schema/timeline.json`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Timeline Data",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "timestamp": { "type": "string", "format": "date-time" },
      "metricA": { "type": "number" },
      "metricB": { "type": "number" }
    },
    "required": ["timestamp", "metricA", "metricB"]
  }
}
```

### AJV Validation Flow (`src/eval/validation.ts`)
```ts
import Ajv from 'ajv';
import schema from '../../schema/timeline.json';

// Define error class for validation failures
export class ValidationError extends Error {
  constructor(public errors: Ajv.ErrorObject[] | null | undefined) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

// Define Timeline types
export type TimelineEvent = {
  timestamp: string;
  metricA: number;
  metricB: number;
  context?: string;
  decision?: {
    id: string;
    reasoning: string;
    dependencies: string[];
  };
};

// Two validation modes available:
// 1. Fail-fast (default): Stop at first error
// 2. Continue: Collect all errors (allErrors: true)

// Fail-fast validator (default)
const ajv = new Ajv();
const validateFast = ajv.compile<TimelineEvent[]>(schema);

// Continue validator (collects all errors)
const ajvAllErrors = new Ajv({ allErrors: true });
const validateAll = ajvAllErrors.compile<TimelineEvent[]>(schema);

/**
 * Validates timeline data against schema
 * @param data - The data to validate
 * @param collectAllErrors - Whether to collect all errors or fail fast
 * @returns Validated timeline data
 * @throws ValidationError with detailed error information
 */
export function validateTimeline(data: unknown, collectAllErrors = false): TimelineEvent[] {
  const validator = collectAllErrors ? validateAll : validateFast;
  
  if (!validator(data)) {
    throw new ValidationError(validator.errors);
  }
  return data as TimelineEvent[];
}

/**
 * Formats validation errors into user-friendly messages
 * @param errors - AJV error objects
 * @returns Array of formatted error messages
 */
export function formatValidationErrors(errors: Ajv.ErrorObject[] = []): string[] {
  return errors.map(error => {
    const path = error.instancePath ? error.instancePath : '/';
    
    switch (error.keyword) {
      case 'required':
        return `Missing required property '${error.params.missingProperty}' at ${path}`;
      case 'type':
        return `Invalid type at ${path}: expected ${error.params.type}`;
      case 'format':
        return `Invalid format at ${path}: value does not match ${error.params.format} format`;
      default:
        return `${path}: ${error.message}`;
    }
  });
}

// Sample error messages:
// - "Missing required property 'timestamp' at /0"
// - "Invalid type at /0/metricA: expected number"
// - "Invalid format at /0/timestamp: value does not match date-time format"
```

### Metric Computation Modules (`src/eval/metrics.ts`)
```ts
import { TimelineEvent } from './validation';

// Base metrics interface
export interface Metrics {
  name: string;
  description: string;
}

// Summary metrics interface
export interface SummaryMetrics extends Metrics {
  totalEvents: number;
  averageA: number;
  averageB: number;
}

// Context isolation metrics interface
export interface ContextIsolationMetrics extends Metrics {
  score: number;
  crossContextDependencies: number;
  totalDependencies: number;
  contexts: string[];
}

// Decision traceability metrics interface
export interface DecisionTraceabilityMetrics extends Metrics {
  score: number;
  tracedDecisions: number;
  totalDecisions: number;
  unresolvedDependencies: string[];
}

/**
 * Computes basic summary metrics from timeline events
 * @param events - Array of timeline events
 * @returns Summary metrics object
 */
export function computeSummaryMetrics(events: TimelineEvent[]): SummaryMetrics {
  const total = events.length;
  const sumA = events.reduce((acc, e) => acc + e.metricA, 0);
  const sumB = events.reduce((acc, e) => acc + e.metricB, 0);
  
  return {
    name: 'Summary Metrics',
    description: 'Basic statistical metrics for timeline events',
    totalEvents: total,
    averageA: total ? sumA / total : 0,
    averageB: total ? sumB / total : 0
  };
}

/**
 * Computes context isolation score - measures how well contexts are isolated
 * Higher score (closer to 1.0) indicates better isolation between contexts
 * @param events - Array of timeline events
 * @returns Context isolation metrics
 */
export function computeContextIsolation(events: TimelineEvent[]): ContextIsolationMetrics {
  // Handle edge case: empty timeline
  if (!events.length) {
    return {
      name: 'Context Isolation',
      description: 'Measures separation between different contexts',
      score: 1.0,
      crossContextDependencies: 0,
      totalDependencies: 0,
      contexts: []
    };
  }
  
  // Group events by context
  const contexts = new Map<string, Set<string>>();
  
  events.forEach(event => {
    const contextName = event.context || 'default';
    if (!contexts.has(contextName)) {
      contexts.set(contextName, new Set<string>());
    }
    // Use timestamp as ID if no explicit ID is provided
    const eventId = event.decision?.id || event.timestamp;
    contexts.get(contextName)!.add(eventId);
  });
  
  // Count cross-context dependencies
  let crossContextDependencies = 0;
  let totalDependencies = 0;
  
  events.forEach(event => {
    if (event.decision?.dependencies) {
      totalDependencies += event.decision.dependencies.length;
      
      event.decision.dependencies.forEach(depId => {
        // Find which context this dependency belongs to
        let depContext: string | null = null;
        const eventContext = event.context || 'default';
        
        for (const [context, eventIds] of contexts.entries()) {
          if (eventIds.has(depId)) {
            depContext = context;
            break;
          }
        }
        
        // If dependency is from different context, count it
        if (depContext && depContext !== eventContext) {
          crossContextDependencies++;
        }
      });
    }
  });
  
  // Calculate isolation score (1.0 = perfect isolation, 0.0 = no isolation)
  const score = totalDependencies === 0 ?
    1.0 :
    1.0 - (crossContextDependencies / totalDependencies);
  
  return {
    name: 'Context Isolation',
    description: 'Measures separation between different contexts',
    score,
    crossContextDependencies,
    totalDependencies,
    contexts: Array.from(contexts.keys())
  };
}

/**
 * Computes decision traceability score - measures how well decisions can be traced
 * Higher score (closer to 1.0) indicates better traceability
 * @param events - Array of timeline events
 * @returns Decision traceability metrics
 */
export function computeDecisionTraceability(events: TimelineEvent[]): DecisionTraceabilityMetrics {
  // Extract events with decisions
  const decisionsEvents = events.filter(event => event.decision);
  
  // Handle edge case: no decisions to trace
  if (decisionsEvents.length === 0) {
    return {
      name: 'Decision Traceability',
      description: 'Measures how well decisions can be traced to dependencies',
      score: 1.0,
      tracedDecisions: 0,
      totalDecisions: 0,
      unresolvedDependencies: []
    };
  }
  
  // Map of event IDs/timestamps to events for quick lookup
  const eventMap = new Map<string, TimelineEvent>();
  events.forEach(event => {
    const eventId = event.decision?.id || event.timestamp;
    eventMap.set(eventId, event);
  });
  
  let totalDependencies = 0;
  let resolvedDependencies = 0;
  const unresolvedDeps: string[] = [];
  
  decisionsEvents.forEach(event => {
    if (event.decision?.dependencies) {
      totalDependencies += event.decision.dependencies.length;
      
      event.decision.dependencies.forEach(depId => {
        if (eventMap.has(depId)) {
          resolvedDependencies++;
        } else {
          unresolvedDeps.push(depId);
        }
      });
    }
  });
  
  // Calculate traceability score
  const score = totalDependencies === 0 ?
    1.0 : // Perfect score if no dependencies needed
    resolvedDependencies / totalDependencies;
  
  return {
    name: 'Decision Traceability',
    description: 'Measures how well decisions can be traced to dependencies',
    score,
    tracedDecisions: resolvedDependencies,
    totalDecisions: totalDependencies,
    unresolvedDependencies: unresolvedDeps
  };
}
```

### Handlebars Template & Threshold Logic (`src/eval/template.hbs`)
```hbs
# Evaluation Report

Date: {{date}}

## Summary Metrics
- Total Events: {{metrics.totalEvents}}
- Average A: {{metrics.averageA}}
- Average B: {{metrics.averageB}}

## Threshold Pass/Fail
{{#if (gt metrics.averageA thresholdA)}}
✔ Metric A passed threshold of {{thresholdA}}
{{else}}
✖ Metric A failed threshold of {{thresholdA}}
{{/if}}
{{#if (gt metrics.averageB thresholdB)}}
✔ Metric B passed threshold of {{thresholdB}}
{{else}}
✖ Metric B failed threshold of {{thresholdB}}
{{/if}}
```

### Report Generation (`src/eval/report.ts`)
```ts
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { validateTimeline } from './validation';
import { computeSummaryMetrics } from './metrics';

export async function generateReport(
  dataPath: string,
  outputPath = 'reports/eval-report.md'
): Promise<void> {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const events = validateTimeline(JSON.parse(raw));
  const metrics = computeSummaryMetrics(events);
  const templateSrc = fs.readFileSync(
    path.resolve(__dirname, 'template.hbs'),
    'utf-8'
  );
  const template = Handlebars.compile(templateSrc);
  const report = template({
    date: new Date().toISOString(),
    metrics,
    thresholdA: 10,
    thresholdB: 20
  });
  fs.writeFileSync(outputPath, report);
}
```

## CI Integration & Scripts

Add to [`package.json`](package.json:1):
```json
"scripts": {
  "eval:report": "ts-node src/eval/report.ts",
  "eval:validate": "ts-node src/eval/cli.ts validate",
  "eval:metrics": "ts-node src/eval/cli.ts metrics",
  "eval:ci": "ts-node src/eval/cli.ts ci"
}
```

### Exit Code Conventions

The CLI tool follows standard exit code conventions:

- **0**: Success - All validations pass and metrics meet thresholds
- **1**: Validation Error - Schema validation failed (data format issues)
- **2**: Metric Computation Error - Metrics calculation failed or thresholds not met

Implementation in `src/eval/cli.ts`:

```ts
import { validateTimeline, formatValidationErrors } from './validation';
import { computeContextIsolation, computeDecisionTraceability } from './metrics';
import fs from 'fs';

enum ExitCode {
  SUCCESS = 0,
  VALIDATION_ERROR = 1,
  COMPUTATION_ERROR = 2
}

async function main() {
  const command = process.argv[2] || 'validate';
  const dataPath = process.argv[3] || 'data/timeline.json';
  
  try {
    // Read and parse data
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);
    
    // Validate data
    try {
      const events = validateTimeline(data, true); // Collect all errors
      console.log(`✅ Validation passed: ${events.length} events`);
      
      if (command === 'validate') {
        process.exit(ExitCode.SUCCESS);
      }
      
      // Compute metrics if needed
      if (command === 'metrics' || command === 'ci') {
        const isolation = computeContextIsolation(events);
        const traceability = computeDecisionTraceability(events);
        
        console.log(`Context Isolation Score: ${isolation.score.toFixed(2)}`);
        console.log(`Decision Traceability Score: ${traceability.score.toFixed(2)}`);
        
        // Check thresholds in CI mode
        if (command === 'ci') {
          const isolationThreshold = 0.8;
          const traceabilityThreshold = 0.9;
          
          if (isolation.score < isolationThreshold || traceability.score < traceabilityThreshold) {
            console.error('❌ Metrics below threshold');
            process.exit(ExitCode.COMPUTATION_ERROR);
          }
        }
        
        process.exit(ExitCode.SUCCESS);
      }
      
    } catch (validationError: any) {
      if (validationError.errors) {
        const messages = formatValidationErrors(validationError.errors);
        console.error('❌ Validation failed:');
        messages.forEach(msg => console.error(`  - ${msg}`));
      } else {
        console.error(`❌ Validation error: ${validationError.message}`);
      }
      process.exit(ExitCode.VALIDATION_ERROR);
    }
    
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(ExitCode.COMPUTATION_ERROR);
  }
}

main();
```

## Error Handling Strategy

### Validation Error Handling
- **Fail-Fast Mode**: Stops at first validation error (default)
  - Efficient for CI pipelines where any error is a failure
  - Example: `validateTimeline(data, false)`
- **Continue Mode**: Collects all validation errors
  - Better for development and debugging
  - Example: `validateTimeline(data, true)`
- All validation errors throw `ValidationError` with detailed AJV errors
- Error formatting via `formatValidationErrors()` provides user-friendly messages

### Computation Error Handling
- Metric computation functions handle edge cases (empty arrays, missing data)
- Each metric returns detailed diagnostic information (not just scores)
- Computation errors throw descriptive exceptions with context
- Metrics below thresholds in CI mode result in exit code 2

### CI Integration
- CI script fails with appropriate exit code based on error type
- Exit code 1 indicates data format issues (fix your data)
- Exit code 2 indicates metric issues (improve your implementation)
- Detailed error output helps diagnose issues quickly

## Testing Strategy
- Unit tests with Jest in `__tests__/eval/`  
- Test cases: valid data, empty array, malformed JSON, threshold boundary

## Security Considerations
- Validate untrusted JSON strictly against schema  
- No external network calls

## Performance Implications
- O(n) processing; acceptable for datasets <100k events  
- Consider streaming or batching for larger inputs

**End of Design**