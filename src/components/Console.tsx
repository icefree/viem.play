import React, { useState, useEffect, useRef } from 'react'
import { useLogStore } from '../stores/useLogStore'
import './Console.css'

export const Console: React.FC = () => {
  const { logs, clearLogs } = useLogStore()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredLogs = logs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase()) || 
    log.source?.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    // Scroll to bottom when new logs arrive and panel is open
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [logs.length, isOpen])

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const renderData = (data: any) => {
    if (!data) return null
    try {
      if (typeof data === 'object') {
        return <pre className="log-data">{JSON.stringify(data, (key, value) => typeof value === 'bigint' ? value.toString() + 'n' : value, 2)}</pre>
      }
      return <span className="log-data">{String(data)}</span>
    } catch (e) {
      return null
    }
  }

  return (
    <div className={`console-panel ${isOpen ? 'open' : 'closed'}`}>
      <div className="console-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="console-title">
          <span className="terminal-icon">$_</span>
          Console {logs.length > 0 && <span className="log-count">{logs.length}</span>}
        </div>
        <div className="console-actions" onClick={e => e.stopPropagation()}>
          {isOpen && (
            <>
              <input 
                type="text" 
                placeholder="Filter logs..." 
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="console-filter"
              />
              <button onClick={clearLogs} className="console-btn" title="Clear Console">🚫</button>
            </>
          )}
          <button className="console-toggle">{isOpen ? '▼' : '▲'}</button>
        </div>
      </div>
      
      {isOpen && (
        <div className="console-body" ref={scrollRef}>
          {filteredLogs.length === 0 ? (
            <div className="console-empty">No logs to display</div>
          ) : (
            filteredLogs.map(log => (
              <div key={log.id} className={`log-entry ${log.level}`}>
                <div className="log-meta">
                  <span className="log-time">[{formatTime(log.timestamp)}]</span>
                  {log.source && <span className="log-source">[{log.source}]</span>}
                  <span className={`log-level-badge ${log.level}`}>{log.level.toUpperCase()}</span>
                </div>
                <div className="log-content">
                  <span className="log-message">{log.message}</span>
                  {renderData(log.data)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
