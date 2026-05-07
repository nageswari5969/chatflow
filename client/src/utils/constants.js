export const EVENTS = {
  // Chat
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_READ: 'message:read',
  MESSAGE_DELETE: 'message:delete',
  // Typing
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  // Presence
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  // Group
  GROUP_MESSAGE: 'group:message',
  GROUP_JOIN: 'group:join',
  GROUP_LEAVE: 'group:leave',
  // Calls
  CALL_INCOMING: 'call:incoming',
  CALL_ACCEPT: 'call:accept',
  CALL_REJECT: 'call:reject',
  CALL_END: 'call:end',
  CALL_SIGNAL: 'call:signal',
}

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
}

export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
}
