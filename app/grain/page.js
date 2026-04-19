'use client'

import { useState, useEffect } from 'react'
import './grain.css'

function EntryCard({ e }) {
  const bClass = d => d === 'technical' ? 'bt' : d === 'creative' ? 'bc' : 'bl'
  const relDate = ts => {
    const d = Math.floor((Date.now() - ts) / 86400000)
    if (d === 0) return 'today'
    if (d === 1) return 'yesterday'
    if (d < 7) return `${d}d ago`
    return new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }
  return (
    <div className="g-le">
      <div className="g-lm">
        <span className={`g-badge ${bClass(e.domain)}`}>{e.domain}</span>
        <span className="g-muted">{relDate(e.ts)}</span>
      </div>
      <p className="g-lt">{e.title}</p>
      <p className="g-lc">{e.compress || '—'}</p>
      {e.pattern && <p className="g-lp">{e.pattern}</p>}
    </div>
  )
}

function QItem({ id, tag, text, checks, onToggle }) {
  return (
    <div className={`g-qi ${checks[id] ? 'ck' : ''}`} onClick={() => onToggle(id)}>
      <div className="g-cb"><div className="g-ci" /></div>
      <div>
        <div className="g-qtag">{tag}</div>
        <div className="g-qm">{text}</div>
      </div>
    </div>
  )
}

function StageDots({ active }) {
  return (
    <div className="g-sdots">
      {[1, 2, 3].map(n => <div key={n} className={`g-sdot ${active >= n ? 'on' : ''}`} />)}
    </div>
  )
}

export default function GrainApp() {
  const [screen, setScreen]         = useState('home')
  const [domain, setDomain]         = useState('technical')
  const [checks, setChecks]         = useState({})
  const [probTitle, setProbTitle]   = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [beforeNotes, setBeforeNotes] = useState('')
  const [stuckNotes, setStuckNotes] = useState('')
  const [patInput, setPatInput]     = useState('')
  const [cmpInput, setCmpInput]     = useState('')
  const [savedLine, setSavedLine]   = useState('')
  const [logFilter, setLogFilter]   = useState('all')
  const [logSearch, setLogSearch]   = useState('')
  const [entries, setEntries]       = useState([])

  useEffect(() => {
    try {
      setEntries(JSON.parse(localStorage.getItem('grain_log') || '[]'))
    } catch { setEntries([]) }
  }, [])

  const saveEntries = next => {
    setEntries(next)
    try { localStorage.setItem('grain_log', JSON.stringify(next)) } catch {}
  }

  const show = s => { setScreen(s); window.scrollTo(0, 0) }

  const goStage = stage => {
    setCurrentTitle(probTitle.trim() || 'Untitled')
    show(stage)
  }

  const reset = () => {
    setDomain('technical'); setChecks({})
    setProbTitle(''); setBeforeNotes(''); setStuckNotes('')
    setPatInput(''); setCmpInput('')
  }

  const toggleCheck = id => setChecks(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSave = () => {
    const compress = cmpInput.trim()
    if (!compress) return
    const entry = {
      id: Date.now(), ts: Date.now(),
      title: currentTitle, domain, compress,
      pattern: patInput.trim(),
      bn: beforeNotes, sn: stuckNotes,
    }
    saveEntries([...entries, entry])
    setSavedLine(compress)
    show('saved')
  }

  const filtered = entries.slice().reverse().filter(e => {
    if (logFilter !== 'all' && e.domain !== logFilter) return false
    if (logSearch && !(e.compress + e.title + e.pattern).toLowerCase().includes(logSearch.toLowerCase())) return false
    return true
  })

  const qProps = { checks, onToggle: toggleCheck }

  return (
    <div className="g-wrap">

      {/* ── HOME ── */}
      {screen === 'home' && (
        <div className="g-screen">
          <div className="g-wordmark">Grain</div>
          <p className="g-tagline">Extract the grain.</p>
          <button className="g-btn-p" style={{ marginBottom: 10 }} onClick={() => { reset(); show('setup') }}>
            New problem →
          </button>
          <button className="g-btn-s" onClick={() => show('log')}>Grain Log</button>
          <div style={{ marginTop: '2.25rem' }}>
            <p className="g-micro" style={{ marginBottom: 14 }}>Recent grains</p>
            {entries.length === 0
              ? <p className="g-empty">No grains yet.<br />Solve your first problem.</p>
              : entries.slice(-3).reverse().map(e => <EntryCard key={e.id} e={e} />)
            }
          </div>
        </div>
      )}

      {/* ── SETUP ── */}
      {screen === 'setup' && (
        <div className="g-screen">
          <div className="g-toprow"><button className="g-btn-g" onClick={() => show('home')}>← back</button></div>
          <p className="g-h2">What are you working on?</p>
          <span className="g-label">Name this problem</span>
          <input
            type="text" value={probTitle}
            onChange={e => setProbTitle(e.target.value)}
            placeholder="e.g. variant image not switching on mobile"
            style={{ marginBottom: '1.25rem' }}
          />
          <span className="g-label">Domain</span>
          <div className="g-d-opts" style={{ marginBottom: '1.5rem' }}>
            {['technical', 'creative', 'life'].map(d => (
              <button key={d} className={`g-d-opt ${domain === d ? 'on' : ''}`} onClick={() => setDomain(d)}>
                {d[0].toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
          <span className="g-label" style={{ marginBottom: 8 }}>Start at</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('before')}>Before</button>
            <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('stuck')}>Stuck</button>
            <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('after')}>After</button>
          </div>
        </div>
      )}

      {/* ── BEFORE ── */}
      {screen === 'before' && (
        <div className="g-screen">
          <div className="g-toprow">
            <button className="g-btn-g" onClick={() => show('setup')}>← back</button>
            <button className="g-btn-g" onClick={() => show('stuck')}>skip →</button>
          </div>
          <StageDots active={1} />
          <p className="g-muted" style={{ marginBottom: 5 }}>{currentTitle}</p>
          <p className="g-h2">Before you start</p>
          <QItem id="b1" tag="Clarify"     text="What is the real outcome — not just the task?" {...qProps} />
          <QItem id="b2" tag="Separate"    text="What do I know vs what am I assuming?" {...qProps} />
          <QItem id="b3" tag="Define done" text="What does success look like concretely?" {...qProps} />
          <QItem id="b4" tag="Scope"       text="What's the smallest version I can test first?" {...qProps} />
          <div className="g-gap">
            <span className="g-label">Write your thinking <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
            <textarea value={beforeNotes} onChange={e => setBeforeNotes(e.target.value)} rows={3} placeholder="Real goal, key assumptions, what done looks like..." />
          </div>
          <div className="g-gap"><button className="g-btn-p" onClick={() => show('stuck')}>Ready to start →</button></div>
        </div>
      )}

      {/* ── STUCK ── */}
      {screen === 'stuck' && (
        <div className="g-screen">
          <div className="g-toprow">
            <button className="g-btn-g" onClick={() => show('before')}>← back</button>
            <button className="g-btn-g" onClick={() => show('after')}>skip →</button>
          </div>
          <StageDots active={2} />
          <p className="g-muted" style={{ marginBottom: 5 }}>{currentTitle}</p>
          <p className="g-h2">You&apos;re stuck</p>
          <QItem id="s1" tag="Reframe"   text="Am I solving the right problem?" {...qProps} />
          <QItem id="s2" tag="Challenge" text="What assumption am I holding that might be wrong?" {...qProps} />
          <QItem id="s3" tag="Simplify"  text="What's the simplest explanation for why this isn't working?" {...qProps} />
          <QItem id="s4" tag="Distance"  text="What would I tell someone else to do here?" {...qProps} />
          <div className="g-gap">
            <span className="g-label">Write your thinking <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
            <textarea value={stuckNotes} onChange={e => setStuckNotes(e.target.value)} rows={3} placeholder="Wrong assumption, simplest explanation, outside view..." />
          </div>
          <div className="g-gap"><button className="g-btn-p" onClick={() => show('after')}>I see the path →</button></div>
        </div>
      )}

      {/* ── AFTER ── */}
      {screen === 'after' && (
        <div className="g-screen">
          <div className="g-toprow"><button className="g-btn-g" onClick={() => show('stuck')}>← back</button></div>
          <StageDots active={3} />
          <p className="g-muted" style={{ marginBottom: 5 }}>{currentTitle}</p>
          <p className="g-h2">Extract the grain</p>
          <QItem id="a1" tag="Root cause" text="What actually caused this — not the symptom?" {...qProps} />
          <QItem id="a2" tag="Pattern"    text="What category does this problem belong to?" {...qProps} />
          <QItem id="a3" tag="Delta"      text="What would I do differently at the start?" {...qProps} />
          <QItem id="a4" tag="Grain"      text="What's the single line I want to carry forward — permanently?" {...qProps} />
          <div className="g-gap">
            <span className="g-label">Pattern name <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(short label)</span></span>
            <input type="text" value={patInput} onChange={e => setPatInput(e.target.value)} placeholder="e.g. async timing bug, brief gap, avoidance" style={{ marginBottom: '1rem' }} />
            <span className="g-label">Your grain <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>— the one sentence you keep</span></span>
            <textarea value={cmpInput} onChange={e => setCmpInput(e.target.value)} rows={3} placeholder="The single most important insight from this problem..." />
          </div>
          <div className="g-gap"><button className="g-btn-p" onClick={handleSave}>Save to Grain Log →</button></div>
        </div>
      )}

      {/* ── SAVED ── */}
      {screen === 'saved' && (
        <div className="g-screen">
          <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
            <div className="g-saved-ring" />
            <p className="g-saved-label">Grain saved.</p>
            <p className="g-saved-compress">&ldquo;{savedLine}&rdquo;</p>
            <button className="g-btn-p" style={{ marginBottom: 10 }} onClick={() => { reset(); show('setup') }}>New problem →</button>
            <button className="g-btn-s" onClick={() => show('log')}>Grain Log</button>
          </div>
        </div>
      )}

      {/* ── GRAIN LOG ── */}
      {screen === 'log' && (
        <div className="g-screen">
          <div className="g-toprow">
            <button className="g-btn-g" onClick={() => show('home')}>← home</button>
            <div className="g-wordmark" style={{ fontSize: 20 }}>Gr<em>ai</em>n Log</div>
            <div style={{ width: 44 }} />
          </div>
          <input type="text" value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search grains..." style={{ marginBottom: 10 }} />
          <div className="g-d-opts" style={{ marginBottom: '1.5rem' }}>
            {['all', 'technical', 'creative', 'life'].map(f => (
              <button key={f} className={`g-d-opt ${logFilter === f ? 'on' : ''}`} onClick={() => setLogFilter(f)}>
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          {filtered.length === 0
            ? <p className="g-empty">No grains found.</p>
            : filtered.map(e => <EntryCard key={e.id} e={e} />)
          }
        </div>
      )}

    </div>
  )
}
