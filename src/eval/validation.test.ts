import { validateTimeline, ValidationError } from "./validation";
import { Timeline } from "./types";
import validTimeline from "./__tests__/fixtures/valid-timeline.json";
import invalidTimeline from "./__tests__/fixtures/invalid-timeline.json";

describe("validateTimeline", () => {
  it("accepts a valid timeline", () => {
    expect(() => {
      const result = validateTimeline(validTimeline);
      expect(result).toBeDefined();
      expect((result as Timeline).events.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  it("rejects an invalid timeline with clear errors", () => {
    expect(() => {
      validateTimeline(invalidTimeline);
    }).toThrow(ValidationError);

    try {
      validateTimeline(invalidTimeline);
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).messages).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/meta/),
          expect.stringMatching(/id/)
        ])
      );
    }
  });
});