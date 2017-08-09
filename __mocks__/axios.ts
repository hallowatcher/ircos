
/*
 * Axios Mock
 * by hallowatcher
 */

export default class Axios {
  public static get(url: string) {
    if (url.indexOf('https://marekkraus.sk/irc4osu/getUserBasic.php?username=') !== -1) {
      return new Promise((resolve, reject) => {
        const userName = url.replace('https://marekkraus.sk/irc4osu/getUserBasic.php?username=', '');

        const response = {
          data: [{ userName }]
        };

        resolve(response);
      });
    }
  }
}
