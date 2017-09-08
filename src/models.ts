export enum MessageType {
  message,
  action,
  system,
  self
}

export interface IMessage {
  nick: string;
  to?: string;
  text: string;
  type?: MessageType;
  date: Date;
}
