/** Dual locator helper: automation-id (lab contract) + data-testid (spec). */
export function tid(id) {
  return {
    'automation-id': id,
    'data-testid': id
  };
}
