
/*
 * IRC Mock
 * by hallowatcher
 */

import { EventEmitter } from 'events'

export class Client extends EventEmitter {
  connect(retryCount: number, callback) {
    callback()
  }

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