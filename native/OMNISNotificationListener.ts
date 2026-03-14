// This file documents the native module interface.
// Android: Implement NotificationListenerService in Java/Kotlin
// iOS: Use UNUserNotificationCenter delegate
export interface OMNISNotificationListenerInterface {
  startListening(): void;
  stopListening(): void;
  requestAccess(): Promise<boolean>;
  hasAccess(): Promise<boolean>;
}
