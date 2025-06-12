import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { Timeline } from "./types";
import timelineSchema from "../../schema/timeline.json";

const ajv = new Ajv({ allErrors: false, strict: true });
addFormats(ajv);

const validate = ajv.compile(timelineSchema);

export class ValidationError extends Error {
  public readonly messages: string[];
  constructor(messages: string[]) {
    super("Validation failed");
    this.name = "ValidationError";
    this.messages = messages;
  }
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors) return ["Unknown validation error"];
  return errors.map(err => {
    const path = err.instancePath ? err.instancePath : "(root)";
    return `${path} ${err.message ?? ""}`.trim();
  });
}

export function validateTimeline(data: unknown): Timeline {
  if (validate(data)) {
    return data as unknown as Timeline;
  }
  throw new ValidationError(formatAjvErrors(validate.errors));
}