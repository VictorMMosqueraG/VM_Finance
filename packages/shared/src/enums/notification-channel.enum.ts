export const NotificationChannel = {
  PUSH: 'PUSH',
  EMAIL: 'EMAIL',
} as const;

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
