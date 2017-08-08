
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
    callback()
  }
  
  say() {}
  part() {}
}