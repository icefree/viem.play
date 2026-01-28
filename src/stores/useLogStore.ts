import { create } from 'zustand'

export interface LogEntry {
  id: string
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  source?: string
  data?: any
}

interface LogStore {
  logs: LogEntry[]
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void
  clearLogs: () => void
}

export const useLogStore = create<LogStore>((set) => ({
  logs: [],
  addLog: (log) => set((state) => ({
    logs: [
      {
        ...log,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      },
      ...state.logs
    ].slice(0, 500) // Keep last 500 logs
  })),
  clearLogs: () => set({ logs: [] }),
}))

// Singleton logger to be used outside of React components
export const logger = {
  info: (message: string, source?: string, data?: any) => 
    useLogStore.getState().addLog({ level: 'info', message, source, data }),
  warn: (message: string, source?: string, data?: any) => 
    useLogStore.getState().addLog({ level: 'warn', message, source, data }),
  error: (message: string, source?: string, data?: any) => 
    useLogStore.getState().addLog({ level: 'error', message, source, data }),
  debug: (message: string, source?: string, data?: any) => 
    useLogStore.getState().addLog({ level: 'debug', message, source, data }),
}
