"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
exports.validateTimeline = validateTimeline;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const timeline_json_1 = __importDefault(require("../../schema/timeline.json"));
const ajv = new ajv_1.default({ allErrors: false, strict: true });
(0, ajv_formats_1.default)(ajv);
const validate = ajv.compile(timeline_json_1.default);
class ValidationError extends Error {
    constructor(messages) {
        super("Validation failed");
        this.name = "ValidationError";
        this.messages = messages;
    }
}
exports.ValidationError = ValidationError;
function formatAjvErrors(errors) {
    if (!errors)
        return ["Unknown validation error"];
    return errors.map(err => {
        var _a;
        const path = err.instancePath ? err.instancePath : "(root)";
        return `${path} ${(_a = err.message) !== null && _a !== void 0 ? _a : ""}`.trim();
    });
}
function validateTimeline(data) {
    if (validate(data)) {
        return data;
    }
    throw new ValidationError(formatAjvErrors(validate.errors));
}
