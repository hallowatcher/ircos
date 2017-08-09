
/*
 * IRC Mock
 * by hallowatcher
 */

import { EventEmitter } from 'events';

export class Client extends EventEmitter {

  private username: string = null;

  constructor(server: string, user: string, options: any) {
    super();

    this.username = user;
  }

  public connect(retryCount: number, callback) {
    if (this.username === 'error') {
      this.emit('error');
    } else {
      callback();
    }
  }

  public disconnect(param1, param2) { /* Stub */ }

  public join(channel: string, callback) {
    if (channel === '#error') {
      this.emit('error');
    } else {
      callback();
    }
  }

  public say() { /* Stub */ }
  public part() { /* Stub */ }
}
