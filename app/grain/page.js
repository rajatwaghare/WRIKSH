'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RiArrowLeftLine } from 'react-icons/ri'
import gsap from 'gsap'
import './grain.css'

// ─── BREADCRUMB ──────────────────────────────────────────────────────────────

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
      <Link href="/" className="flex items-center gap-1 hover:text-zinc-700 transition-colors">
        <RiArrowLeftLine />
        Home
      </Link>
      <span>/</span>
      <span className="text-zinc-600">Grain</span>
    </div>
  )
}

// ─── ENTRY CARD ──────────────────────────────────────────────────────────────

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

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function GrainApp() {
  const [screen, setScreen]             = useState('home')
  const [domain, setDomain]             = useState('technical')
  const [checks, setChecks]             = useState({})
  const [probTitle, setProbTitle]       = useState('')
  const [currentTitle, setCurrentTitle] = useState('')
  const [beforeNotes, setBeforeNotes]   = useState('')
  const [stuckNotes, setStuckNotes]     = useState('')
  const [patInput, setPatInput]         = useState('')
  const [cmpInput, setCmpInput]         = useState('')
  const [savedLine, setSavedLine]       = useState('')
  const [logFilter, setLogFilter]       = useState('all')
  const [logSearch, setLogSearch]       = useState('')
  const [entries, setEntries]           = useState([])

  const screenRef = useRef(null)

  useEffect(() => {
    try {
      setEntries(JSON.parse(localStorage.getItem('grain_log') || '[]'))
    } catch { setEntries([]) }
  }, [])

  // Animate on every screen change
  useEffect(() => {
    if (!screenRef.current) return
    const els = screenRef.current.querySelectorAll('.gs-fade')
    gsap.fromTo(
      els,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }
    )
  }, [screen])

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
    <div className="flex flex-col flex-1 items-center relative z-10 pb-24">
      <main ref={screenRef} className="flex flex-1 w-full max-w-2xl flex-col gap-6 py-24 pb-0 px-3 md:px-8">

        <Image alt="WRIKSH" src="/logo-black.svg" width={100} height={20} priority className="gs-fade" />
        <div className="gs-fade"><Breadcrumb /></div>

        <div className="g-wrap rounded-lg border bg-white p-6 shadow">

          {/* ── HOME ── */}
          {screen === 'home' && (
            <div className="g-screen">
              <div className="g-wordmark gs-fade">Grain</div>
              <p className="g-tagline gs-fade">Extract the grain.</p>
              <button className="g-btn-p gs-fade" style={{ marginBottom: 10 }} onClick={() => { reset(); show('setup') }}>
                New problem →
              </button>
              <button className="g-btn-s gs-fade" onClick={() => show('log')}>Grain Log</button>
              <div style={{ marginTop: '2.25rem' }} className="gs-fade">
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
              <div className="g-toprow gs-fade"><button className="g-btn-g" onClick={() => show('home')}>← back</button></div>
              <p className="g-h2 gs-fade">What are you working on?</p>
              <div className="gs-fade">
                <span className="g-label">Name this problem</span>
                <input
                  type="text" value={probTitle}
                  onChange={e => setProbTitle(e.target.value)}
                  placeholder="e.g. variant image not switching on mobile"
                  style={{ marginBottom: '1.25rem' }}
                />
              </div>
              <div className="gs-fade">
                <span className="g-label">Domain</span>
                <div className="g-d-opts" style={{ marginBottom: '1.5rem' }}>
                  {['technical', 'creative', 'life'].map(d => (
                    <button key={d} className={`g-d-opt ${domain === d ? 'on' : ''}`} onClick={() => setDomain(d)}>
                      {d[0].toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="gs-fade">
                <span className="g-label" style={{ marginBottom: 8 }}>Start at</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('before')}>Before</button>
                  <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('stuck')}>Stuck</button>
                  <button className="g-btn-s" style={{ flex: 1, fontSize: 13 }} onClick={() => goStage('after')}>After</button>
                </div>
              </div>
            </div>
          )}

          {/* ── BEFORE ── */}
          {screen === 'before' && (
            <div className="g-screen">
              <div className="g-toprow gs-fade">
                <button className="g-btn-g" onClick={() => show('setup')}>← back</button>
                <button className="g-btn-g" onClick={() => show('stuck')}>skip →</button>
              </div>
              <div className="gs-fade"><StageDots active={1} /></div>
              <p className="g-muted gs-fade" style={{ marginBottom: 5 }}>{currentTitle}</p>
              <p className="g-h2 gs-fade">Before you start</p>
              <div className="gs-fade"><QItem id="b1" tag="Clarify"     text="What is the real outcome — not just the task?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="b2" tag="Separate"    text="What do I know vs what am I assuming?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="b3" tag="Define done" text="What does success look like concretely?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="b4" tag="Scope"       text="What's the smallest version I can test first?" {...qProps} /></div>
              <div className="g-gap gs-fade">
                <span className="g-label">Write your thinking <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
                <textarea value={beforeNotes} onChange={e => setBeforeNotes(e.target.value)} rows={3} placeholder="Real goal, key assumptions, what done looks like..." />
              </div>
              <div className="g-gap gs-fade"><button className="g-btn-p" onClick={() => show('stuck')}>Ready to start →</button></div>
            </div>
          )}

          {/* ── STUCK ── */}
          {screen === 'stuck' && (
            <div className="g-screen">
              <div className="g-toprow gs-fade">
                <button className="g-btn-g" onClick={() => show('before')}>← back</button>
                <button className="g-btn-g" onClick={() => show('after')}>skip →</button>
              </div>
              <div className="gs-fade"><StageDots active={2} /></div>
              <p className="g-muted gs-fade" style={{ marginBottom: 5 }}>{currentTitle}</p>
              <p className="g-h2 gs-fade">You&apos;re stuck</p>
              <div className="gs-fade"><QItem id="s1" tag="Reframe"   text="Am I solving the right problem?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="s2" tag="Challenge" text="What assumption am I holding that might be wrong?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="s3" tag="Simplify"  text="What's the simplest explanation for why this isn't working?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="s4" tag="Distance"  text="What would I tell someone else to do here?" {...qProps} /></div>
              <div className="g-gap gs-fade">
                <span className="g-label">Write your thinking <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(optional)</span></span>
                <textarea value={stuckNotes} onChange={e => setStuckNotes(e.target.value)} rows={3} placeholder="Wrong assumption, simplest explanation, outside view..." />
              </div>
              <div className="g-gap gs-fade"><button className="g-btn-p" onClick={() => show('after')}>I see the path →</button></div>
            </div>
          )}

          {/* ── AFTER ── */}
          {screen === 'after' && (
            <div className="g-screen">
              <div className="g-toprow gs-fade"><button className="g-btn-g" onClick={() => show('stuck')}>← back</button></div>
              <div className="gs-fade"><StageDots active={3} /></div>
              <p className="g-muted gs-fade" style={{ marginBottom: 5 }}>{currentTitle}</p>
              <p className="g-h2 gs-fade">Extract the grain</p>
              <div className="gs-fade"><QItem id="a1" tag="Root cause" text="What actually caused this — not the symptom?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="a2" tag="Pattern"    text="What category does this problem belong to?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="a3" tag="Delta"      text="What would I do differently at the start?" {...qProps} /></div>
              <div className="gs-fade"><QItem id="a4" tag="Grain"      text="What's the single line I want to carry forward — permanently?" {...qProps} /></div>
              <div className="g-gap gs-fade">
                <span className="g-label">Pattern name <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>(short label)</span></span>
                <input type="text" value={patInput} onChange={e => setPatInput(e.target.value)} placeholder="e.g. async timing bug, brief gap, avoidance" style={{ marginBottom: '1rem' }} />
                <span className="g-label">Your grain <span className="g-muted" style={{ textTransform: 'none', letterSpacing: 0 }}>— the one sentence you keep</span></span>
                <textarea value={cmpInput} onChange={e => setCmpInput(e.target.value)} rows={3} placeholder="The single most important insight from this problem..." />
              </div>
              <div className="g-gap gs-fade"><button className="g-btn-p" onClick={handleSave}>Save to Grain Log →</button></div>
            </div>
          )}

          {/* ── SAVED ── */}
          {screen === 'saved' && (
            <div className="g-screen">
              <div style={{ textAlign: 'center', padding: '3.5rem 0' }}>
                <div className="g-saved-ring gs-fade" />
                <p className="g-saved-label gs-fade">Grain saved.</p>
                <p className="g-saved-compress gs-fade">&ldquo;{savedLine}&rdquo;</p>
                <button className="g-btn-p gs-fade" style={{ marginBottom: 10 }} onClick={() => { reset(); show('setup') }}>New problem →</button>
                <button className="g-btn-s gs-fade" onClick={() => show('log')}>Grain Log</button>
              </div>
            </div>
          )}

          {/* ── GRAIN LOG ── */}
          {screen === 'log' && (
            <div className="g-screen">
              <div className="g-toprow gs-fade">
                <button className="g-btn-g" onClick={() => show('home')}>← home</button>
                <div className="g-wordmark" style={{ fontSize: 20 }}>Gr<em>ai</em>n Log</div>
                <div style={{ width: 44 }} />
              </div>
              <div className="gs-fade">
                <input type="text" value={logSearch} onChange={e => setLogSearch(e.target.value)} placeholder="Search grains..." style={{ marginBottom: 10 }} />
              </div>
              <div className="g-d-opts gs-fade" style={{ marginBottom: '1.5rem' }}>
                {['all', 'technical', 'creative', 'life'].map(f => (
                  <button key={f} className={`g-d-opt ${logFilter === f ? 'on' : ''}`} onClick={() => setLogFilter(f)}>
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="gs-fade">
                {filtered.length === 0
                  ? <p className="g-empty">No grains found.</p>
                  : filtered.map(e => <EntryCard key={e.id} e={e} />)
                }
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}