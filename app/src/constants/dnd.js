import { defaultDropAnimationSideEffects } from "@dnd-kit/core";

const COLUMN_PREFIX = "column:";

export const toColumnId = (status) => `${COLUMN_PREFIX}${status}`;

export const fromColumnId = (id) => {
  const value = String(id);
  return value.startsWith(COLUMN_PREFIX) ? value.slice(COLUMN_PREFIX.length) : null;
};

export const SORTABLE_TRANSITION = {
  duration: 220,
  easing: "cubic-bezier(0.25, 1, 0.5, 1)",
};

export const DROP_ANIMATION = {
  duration: 260,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0" } },
  }),
};

export const REMOVE_DURATION = 180;

export const SENSOR_OPTIONS = {
  mouse: { activationConstraint: { distance: 6 } },
  touch: { activationConstraint: { delay: 200, tolerance: 8 } },
};
