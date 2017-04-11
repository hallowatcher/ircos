
/*
 * IRC Mock
 * by hallowatcher
 */

import { EventEmitter } from 'events'

export class Client extends EventEmitter {
  connect(retryCount: number, callback) {
    callback()
  }

  join() {}
  say() {}
  part() {}
}