
import { shell } from 'electron';

export function openExternal(url: string) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      shell.openExternal(url);
      resolve();
    });
  };
}
