
/*
 * IRC Mock
 * by hallowatcher
 */

import { EventEmitter } from 'events'

export class Client extends EventEmitter {
  
  username: string = null;

  constructor(server: string, user: string, options: any) {
    super()

    this.username = user;
  }

  connect(retryCount: number, callback) {
    if (this.username === 'error')
      this.emit('error')
    else
      callback()
  }

  disconnect(param1, param2) {}

  join(channel: string, callback) {
    if (channel === '#error') {
      this.emit('error')
    } else {
      callback()
    }
  }
  
  say() {}
  part() {}
}