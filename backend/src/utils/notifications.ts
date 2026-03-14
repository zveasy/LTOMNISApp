import db from '../database';
import {v4 as uuidv4} from 'uuid';

export function createNotification(userId: string, type: string, title: string, message: string, referenceId?: string): void {
  db.prepare('INSERT INTO notifications (id, user_id, type, title, message, reference_id) VALUES (?, ?, ?, ?, ?, ?)').run(
    uuidv4(), userId, type, title, message, referenceId || null
  );
}
