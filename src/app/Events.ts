type Callback = (data?: any) => void;

class EventBus {
  private subscribers: Map<string, Callback[]> = new Map();

  on(event: EventType, callback: Callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);
  }

  emit(event: EventType, data?: any) {
    this.subscribers.get(event)?.forEach(callback => callback(data));
  }
}

export const Events = new EventBus();

export enum EventType {
  START_POSITION_CHANGED = "START_POSITION_CHANGED",
  GOAL_POSITION_CHANGED = "GOAL_POSITION_CHANGED",

  EXPLORED_FIELD_ADDED = "EXPLORED_FIELD_ADDED",
  FINAL_PATH_ADDED = "FINAL_PATH_ADDED",

  MISSING_INFORMATION = "MISSING_INFORMATION",
}
