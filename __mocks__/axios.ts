
/*
 * Axios Mock
 * by hallowatcher
 */

export default class Axios {
  static get(url: string) {
    if (url.indexOf('https://marekkraus.sk/irc4osu/getUserBasic.php?username=') !== -1) {
      return new Promise((resolve, reject) => {
        let userName = url.replace('https://marekkraus.sk/irc4osu/getUserBasic.php?username=', '')

        let response = {
          data: [{ userName }]
        }

        resolve(response)
      })
    }
  }
}