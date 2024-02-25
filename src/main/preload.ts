// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { HANDLERS } from './constants';
import { Api, HandlersType } from './types';

const safeApi: Api = {} as Api;
Object.keys(HANDLERS).forEach((key) => {
  //@ts-ignore
  safeApi[key] = (args: any) =>
    ipcRenderer.invoke(HANDLERS[key as HandlersType], args);
});

contextBridge.exposeInMainWorld('api', safeApi as Api);
