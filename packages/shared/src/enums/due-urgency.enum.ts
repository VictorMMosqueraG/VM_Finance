export const DueUrgency = {
  OVERDUE_OR_TODAY: 'OVERDUE_OR_TODAY',
  SOON: 'SOON',
  OK: 'OK',
} as const;

export type DueUrgency = (typeof DueUrgency)[keyof typeof DueUrgency];
