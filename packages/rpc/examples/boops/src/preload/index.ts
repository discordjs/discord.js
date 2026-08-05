import { electronAPI, type ElectronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { contextIsolated } from 'node:process'

declare global {
  interface Window {
    api: unknown
    electron: ElectronAPI
  }
}

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
