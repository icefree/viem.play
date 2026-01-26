import './ShortcutsPanel.css'

export function ShortcutsPanel() {
  const isMac = navigator.platform.includes('Mac')
  const cmd = isMac ? '⌘' : 'Ctrl'

  const shortcuts = [
    { keys: ['Space'], label: 'Search Nodes' },
    { keys: [cmd, 'K'], label: 'Search Nodes' },
    { keys: [cmd, 'Z'], label: 'Undo' },
    { keys: [cmd, 'Shift', 'Z'], label: 'Redo' },
    { keys: [cmd, 'Y'], label: 'Redo' },
    { keys: ['Del'], label: 'Delete Node' },
    { keys: ['Double Click Slot'], label: 'Auto-pair Node' },
  ]

  return (
    <div className="shortcuts-panel">
      <div className="shortcuts-title">Shortcuts</div>
      <div className="shortcuts-list">
        {shortcuts.map((s, idx) => (
          <div key={idx} className="shortcut-item">
            <div className="shortcut-keys">
              {s.keys.map((k, kIdx) => (
                <span key={kIdx}>
                  <kbd>{k}</kbd>
                  {kIdx < s.keys.length - 1 && <span className="key-plus">+</span>}
                </span>
              ))}
            </div>
            <div className="shortcut-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
