// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { apiKeys } from '../generated/apiKeys';

const api = {};
apiKeys.forEach((key) => {
  //@ts-ignore
  api[key] = (args: any) => ipcRenderer.invoke(`api-${key}`, args);
});
contextBridge.exposeInMainWorld('api', api);
