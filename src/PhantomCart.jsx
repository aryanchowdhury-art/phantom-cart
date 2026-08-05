import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { FileText, Search, Target, GitBranch, Radar } from 'lucide-react';

/* ─── TOKENS ─── */
const c = {
  bg: '#0B0D12',
  surface: '#11141B',
  line: '#1A1E28',
  ink: '#E8EBF2',
  ink2: '#A0A8BC',
  ink3: '#5A6278',
  danger: '#E85D4E',
  dangerBg: 'rgba(232,93,78,0.08)',
  warn: '#F0A82E',
  warnBg: 'rgba(240,168,46,0.08)',
  good: '#3ECF8E',
  goodBg: 'rgba(62,207,142,0.08)',
  ghost: '#9B87F5',
  ghostBg: 'rgba(155,135,245,0.08)',
  mono: "'IBM Plex Mono', 'SF Mono', Menlo, monospace",
  sans: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
  display: "'Archivo Expanded', 'Inter', sans-serif",
};

const TABS = [
  { id: 'home', label: 'Home', icon: FileText },
  { id: 'investigation', label: 'Investigation', icon: Search },
  { id: 'strategy', label: 'Strategy', icon: Target },
  { id: 'method', label: 'Method', icon: GitBranch },
  { id: 'detector', label: 'Detector', icon: Radar },
];

const categoryData = [
  { name: 'CPU', rate: 56.6 },
  { name: 'Video Cards', rate: 52.6 },
  { name: 'Motherboard', rate: 51.3 },
  { name: 'Notebook', rate: 37.4 },
  { name: 'Cartridge', rate: 37.1 },
];

const featureImportance = [
  { name: 'Cart Price', value: 0.313 },
  { name: 'Views Before Cart', value: 0.258 },
  { name: 'Minutes to Cart', value: 0.247 },
  { name: 'High-Abandon Category', value: 0.140 },
  { name: 'Categories Browsed', value: 0.043 },
];

const brandData = [
  { name: 'Gigabyte', value: 2095 },
  { name: 'MSI', value: 1840 },
  { name: 'Palit', value: 1753 },
  { name: 'Asus', value: 1449 },
  { name: 'AMD', value: 1127 },
  { name: 'Sapphire', value: 864 },
];

/* ─── HELPERS ─── */
const Kpi = ({ num, label, color, sub }) => (
  <div style={{
    background: c.surface,
    borderTop: `3px solid ${color}`,
    borderRadius: 2,
    padding: '18px 20px',
    flex: '1 1 180px',
    minWidth: 160,
  }}>
    <div style={{ fontFamily: c.mono, fontSize: 28, fontWeight: 600, color, letterSpacing: '-0.02em' }}>{num}</div>
    <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6 }}>{label}</div>
    {sub && <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Tag = ({ children }) => (
  <span style={{
    fontFamily: c.mono, fontSize: 10, fontWeight: 600, color: c.warn,
    border: `1px solid ${c.warn}`, padding: '3px 10px', borderRadius: 2,
    letterSpacing: '0.08em', display: 'inline-block', marginBottom: 16,
  }}>{children}</span>
);

const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: c.mono, fontSize: 11, color: c.ghost, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8, fontWeight: 500 }}>{children}</div>
);

const H2 = ({ children }) => (
  <h2 style={{ fontFamily: c.display, fontSize: 26, margin: '0 0 12px', textTransform: 'uppercase', color: c.ink, letterSpacing: '0.01em', lineHeight: 1.2 }}>{children}</h2>
);

const Insight = ({ children }) => (
  <p style={{ color: c.ink2, fontSize: 15, lineHeight: 1.6, margin: '0 0 20px', maxWidth: 680 }}>{children}</p>
);

const Card = ({ tag, title, children, accent = c.warn }) => (
  <div style={{
    background: c.surface, borderLeft: `3px solid ${accent}`, borderRadius: 2,
    padding: '20px 22px', marginBottom: 14,
  }}>
    <span style={{ fontFamily: c.mono, fontSize: 10, fontWeight: 600, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tag}</span>
    <h3 style={{ fontFamily: c.display, fontSize: 16, margin: '8px 0 6px', textTransform: 'uppercase', color: c.ink, letterSpacing: '0.01em' }}>{title}</h3>
    <p style={{ color: c.ink2, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{children}</p>
  </div>
);

const Bullet = ({ children, accent }) => (
  <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
    <span style={{ color: accent || c.warn, fontFamily: c.mono, fontSize: 12, marginTop: 2, flexShrink: 0 }}>▸</span>
    <p style={{ color: c.ink2, fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>{children}</p>
  </div>
);

const MonoBox = ({ label, value, color }) => (
  <div style={{ background: c.surface, borderLeft: `3px solid ${color}`, padding: '14px 16px', borderRadius: '0 2px 2px 0', marginBottom: 10 }}>
    <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: c.mono, fontSize: 22, fontWeight: 600, color }}>{value}</div>
  </div>
);

/* ─── CHARTS ─── */
const HBar = ({ data, dataKey, color, labels }) => (
  <div style={{ height: 240, marginBottom: 10 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.line} horizontal={false} />
        <XAxis type="number" domain={[0, 60]} tick={{ fill: c.ink3, fontSize: 11, fontFamily: c.mono }} unit="%" axisLine={{ stroke: c.line }} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fill: c.ink, fontSize: 12, fontFamily: c.mono }} width={110} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.line}`, color: c.ink, fontFamily: c.mono, fontSize: 11 }} cursor={{ fill: c.ghostBg }} />
        <Bar dataKey={dataKey} fill={color} barSize={24} radius={[0, 2, 2, 0]}>
          {labels && <LabelList dataKey={dataKey} position="right" fill={c.ink2} fontSize={11} fontFamily={c.mono} formatter={v => `${v}%`} />}
          {data.map((d, i) => <Cell key={i} fill={d.rate > 45 ? c.danger : c.good} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const VBar = ({ data, dataKey, color, labels, formatter }) => (
  <div style={{ height: 260, marginBottom: 10 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
        <XAxis dataKey="name" tick={{ fill: c.ink3, fontSize: 11, fontFamily: c.mono }} axisLine={{ stroke: c.line }} tickLine={false} />
        <YAxis tick={{ fill: c.ink3, fontSize: 11, fontFamily: c.mono }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.line}`, color: c.ink, fontFamily: c.mono, fontSize: 11 }} cursor={{ fill: c.ghostBg }} />
        <Bar dataKey={dataKey} fill={color} barSize={32} radius={[2, 2, 0, 0]}>
          {labels && <LabelList dataKey={dataKey} position="top" fill={c.ink2} fontSize={11} fontFamily={c.mono} formatter={formatter} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* ─── MAIN ─── */
export default function PhantomCart() {
  const [tab, setTab] = useState('home');

  return (
    <div style={{ background: c.bg, color: c.ink, fontFamily: c.sans, minHeight: '100vh' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@600;800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" />

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: c.bg, borderBottom: `1px solid ${c.line}` }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '12px 24px 0', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.ink3, marginRight: 'auto', paddingBottom: 12, letterSpacing: '0.08em' }}>
            PHANTOM_CART // CASE_2026-01
          </span>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                fontFamily: c.mono, fontSize: 11.5, fontWeight: 500, letterSpacing: '0.02em',
                color: active ? c.warn : c.ink3,
                padding: '10px 14px 12px', border: `1px solid ${c.line}`,
                borderBottom: active ? `1px solid ${c.bg}` : 'none',
                borderRadius: '4px 4px 0 0', background: active ? c.bg : c.surface,
                position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Icon size={13} /> {t.label}
                {active && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: c.warn }} />}
              </button>
            );
          })}
        </div>
      </nav>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 24px' }}>

        {/* ═════ HOME ═════ */}
        {tab === 'home' && (
          <>
            <header style={{ padding: '50px 0 40px', borderBottom: `1px solid ${c.line}` }}>
              <Tag>OPEN CASE — E-COMMERCE ABANDONMENT</Tag>
              <h1 style={{ fontFamily: c.display, fontSize: 40, lineHeight: 1.08, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                Hunting the <span style={{ color: c.ghost }}>ghosts</span> of e-commerce
              </h1>
              <Insight>
                <strong>885,129</strong> logged actions. <strong>490,398</strong> sessions. Some shoppers browsed and vanished. Others filled a cart and walked away. This is the investigation into who they were, what they almost bought, and why they left.
              </Insight>

              {/* KPI ROW — above the fold, horizontal scan */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Kpi num="490,398" label="Total Sessions" color={c.ink} />
                <Kpi num="90.8%" label="Window Shoppers" color={c.ghost} sub="never reach cart" />
                <Kpi num="45.7%" label="Cart Abandonment" color={c.danger} sub="carted but left" />
                <Kpi num="5.0%" label="Conversion Rate" color={c.good} sub="completed purchase" />
              </div>
            </header>

            <section style={{ padding: '40px 0' }}>
              <Eyebrow>Case Summary</Eyebrow>
              <H2>Three suspects. One pattern.</H2>
              <Insight>The investigation turned up three consistent leads. All three point the same direction.</Insight>

              <Card tag="LEAD 01" title="Component categories abandon at 51–57%" accent={c.danger}>
                <strong>CPUs</strong>, <strong>graphics cards</strong>, and <strong>motherboards</strong> are abandoned at more than double the rate of everyday items.
              </Card>
              <Card tag="LEAD 02" title="The price gap" accent={c.warn}>
                Carted items average <strong>$159.65</strong>. Purchased items average <strong>$137.24</strong>. Somewhere between cart and checkout, <strong>~$22 disappears</strong>.
              </Card>
              <Card tag="LEAD 03" title="Same brands, every time" accent={c.ghost}>
                <strong>Gigabyte</strong>, <strong>MSI</strong>, <strong>Palit</strong>, <strong>Asus</strong>, <strong>AMD</strong> — the most-abandoned brand list is almost entirely PC components.
              </Card>
            </section>
          </>
        )}

        {/* ═════ INVESTIGATION ═════ */}
        {tab === 'investigation' && (
          <>
            <header style={{ padding: '50px 0 30px', borderBottom: `1px solid ${c.line}` }}>
              <Tag>EVIDENCE LOG</Tag>
              <h1 style={{ fontFamily: c.display, fontSize: 32, textTransform: 'uppercase', margin: 0 }}>The Investigation</h1>
              <Insight>Every session sorted into <strong>Window Shopper</strong>, <strong>Quitter</strong>, or <strong>Converter</strong>. Here's what separates them.</Insight>
            </header>

            <section style={{ padding: '36px 0' }}>
              <Eyebrow>Lead 01</Eyebrow>
              <H2>The component hesitation</H2>
              <Insight>Component categories abandon at <strong>more than double</strong> the rate of everyday items like cartridges or notebooks.</Insight>
              <HBar data={categoryData} dataKey="rate" labels />
            </section>

            <section style={{ padding: '36px 0', borderTop: `1px solid ${c.line}` }}>
              <Eyebrow>Lead 02</Eyebrow>
              <H2>The price gap</H2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <MonoBox label="Average Carted Item" value="$159.65" color={c.ghost} />
                <MonoBox label="Average Purchased Item" value="$137.24" color={c.good} />
              </div>
              <div style={{ fontFamily: c.mono, fontSize: 13, background: c.warnBg, border: `1px dashed ${c.warn}`, padding: '10px 14px', borderRadius: 2, color: c.warn, marginBottom: 14, fontWeight: 500 }}>
                → GAP: $22.41 between carted and purchased averages
              </div>
              <Insight>Quitters' carts average <strong>$182</strong> — higher than Converters' at <strong>$158</strong>. This is measurable sticker shock, not a guess.</Insight>
            </section>

            <section style={{ padding: '36px 0', borderTop: `1px solid ${c.line}` }}>
              <Eyebrow>Lead 03</Eyebrow>
              <H2>The repeat offenders</H2>
              <Insight>Eight of the top ten most-abandoned brands are <strong>component/PC-hardware brands</strong> — the same suspects from Lead 01.</Insight>
              <VBar data={brandData} dataKey="value" color={c.ghost} labels formatter={v => v.toLocaleString()} />
            </section>
          </>
        )}

        {/* ═════ STRATEGY ═════ */}
        {tab === 'strategy' && (
          <>
            <header style={{ padding: '50px 0 30px', borderBottom: `1px solid ${c.line}` }}>
              <Tag>RECOMMENDATIONS</Tag>
              <h1 style={{ fontFamily: c.display, fontSize: 32, textTransform: 'uppercase', margin: 0 }}>The Strategy</h1>
              <Insight>Three leads, three targeted interventions — each built directly on a finding, not a generic playbook.</Insight>
            </header>

            <section style={{ padding: '36px 0' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={{ background: c.surface, borderLeft: `3px solid ${c.danger}`, borderRadius: 2, padding: 18 }}>
                  <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>Built on Lead 01</div>
                  <h3 style={{ fontFamily: c.display, fontSize: 15, margin: '0 0 8px', color: c.danger, textTransform: 'uppercase' }}>Confidence signals on component pages</h3>
                  <p style={{ color: c.ink2, fontSize: 14, lineHeight: 1.6, margin: 0 }}>Add <strong>compatibility badges</strong> and <strong>financing options</strong> on CPU/GPU/motherboard listings — the abandonment is about uncertainty, not desire.</p>
                </div>
                <div style={{ background: c.surface, borderLeft: `3px solid ${c.warn}`, borderRadius: 2, padding: 18 }}>
                  <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>Built on Lead 02</div>
                  <h3 style={{ fontFamily: c.display, fontSize: 15, margin: '0 0 8px', color: c.warn, textTransform: 'uppercase' }}>Threshold-triggered nudges</h3>
                  <p style={{ color: c.ink2, fontSize: 14, lineHeight: 1.6, margin: 0 }}>When a cart item sits above its category's median price, trigger a time-limited offer targeting the measurable <strong>$22 gap</strong>.</p>
                </div>
                <div style={{ background: c.surface, borderLeft: `3px solid ${c.ghost}`, borderRadius: 2, padding: 18 }}>
                  <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>Built on Lead 03</div>
                  <h3 style={{ fontFamily: c.display, fontSize: 15, margin: '0 0 8px', color: c.ghost, textTransform: 'uppercase' }}>Stock & compatibility clarity</h3>
                  <p style={{ color: c.ink2, fontSize: 14, lineHeight: 1.6, margin: 0 }}><strong>Gigabyte</strong>, <strong>MSI</strong>, <strong>Palit</strong>, <strong>Asus</strong>, and <strong>AMD</strong> listings get priority real-time stock status and a compatibility checker.</p>
                </div>
                <div style={{ background: c.surface, borderLeft: `3px solid ${c.good}`, borderRadius: 2, padding: 18 }}>
                  <div style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>Separate problem — 90.8% never cart</div>
                  <h3 style={{ fontFamily: c.display, fontSize: 15, margin: '0 0 8px', color: c.good, textTransform: 'uppercase' }}>Window Shoppers need a different play</h3>
                  <p style={{ color: c.ink2, fontSize: 14, lineHeight: 1.6, margin: 0 }}>This is <strong>top-of-funnel awareness</strong>, not abandonment. Retargeting applies here, not cart-recovery tactics.</p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ═════ METHOD ═════ */}
        {tab === 'method' && (
          <>
            <header style={{ padding: '50px 0 30px', borderBottom: `1px solid ${c.line}` }}>
              <Tag>CASE NOTES — BEHIND THE INVESTIGATION</Tag>
              <h1 style={{ fontFamily: c.display, fontSize: 32, textTransform: 'uppercase', margin: 0 }}>The Method</h1>
              <Insight>A four-stage pipeline — each stage checked before moving to the next.</Insight>
            </header>

            <section style={{ padding: '36px 0' }}>
              <Card tag="STAGE 01" title="Scope the strategy" accent={c.warn}>
                Define the narrative and questions before touching data — what counts as a Window Shopper, Quitter, or Converter, and why the split matters.
              </Card>
              <Card tag="STAGE 02" title="Source the dataset" accent={c.ghost}>
                Find data that can actually answer the scoped questions — session IDs and timestamps are non-negotiable for tracking a journey.
              </Card>
              <Card tag="STAGE 03" title="Verify before building" accent={c.ink3}>
                Audit nulls, duplicates, and missing columns against the narrative before writing dashboard code.
              </Card>
              <Card tag="STAGE 04" title="Build, grounded in evidence" accent={c.good}>
                Every chart and recommendation traces back to a specific verified number — that traceability turns a dashboard into a case file.
              </Card>
            </section>
          </>
        )}

        {/* ═════ DETECTOR ═════ */}
        {tab === 'detector' && (
          <>
            <header style={{ padding: '50px 0 30px', borderBottom: `1px solid ${c.line}` }}>
              <Tag>PROTOTYPE — EARLY-STAGE SIGNAL</Tag>
              <h1 style={{ fontFamily: c.display, fontSize: 32, textTransform: 'uppercase', margin: 0 }}>The Detector</h1>
              <Insight>Can we flag a cart as likely to be abandoned <strong>before</strong> it happens? A prototype model, tested honestly.</Insight>
            </header>

            <section style={{ padding: '36px 0' }}>
              <Eyebrow>Model Performance</Eyebrow>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <Kpi num="56%" label="Accuracy" color={c.warn} />
                <Kpi num="0.59" label="ROC AUC" color={c.warn} />
                <Kpi num="41,270" label="Carts Analyzed" color={c.ink} />
              </div>
              <div style={{ fontFamily: c.mono, fontSize: 13, background: c.warnBg, border: `1px solid ${c.warn}`, padding: '14px 16px', borderRadius: 2, color: c.warn, lineHeight: 1.6, maxWidth: 720, fontWeight: 500 }}>
                Honest read: this is a <strong>directional signal</strong>, not a confident predictor. Clickstream data alone — no device, demographic, or repeat-visit history — caps what any model can learn here.
              </div>
            </section>

            <section style={{ padding: '36px 0', borderTop: `1px solid ${c.line}` }}>
              <Eyebrow>What Drives the Prediction</Eyebrow>
              <H2>Feature importance</H2>
              <Insight><strong>Cart price</strong> is the single strongest signal — independently confirming Lead 02 without being told about it. The model rediscovered the price gap on its own.</Insight>
              <div style={{ height: 260, marginBottom: 10 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical" margin={{ left: 20, right: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={c.line} horizontal={false} />
                    <XAxis type="number" tick={{ fill: c.ink3, fontSize: 11, fontFamily: c.mono }} axisLine={{ stroke: c.line }} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: c.ink, fontSize: 12, fontFamily: c.mono }} width={150} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: c.bg, border: `1px solid ${c.line}`, color: c.ink, fontFamily: c.mono, fontSize: 11 }} cursor={{ fill: c.ghostBg }} formatter={v => [`${(v * 100).toFixed(1)}%`, 'Importance']} />
                    <Bar dataKey="value" fill={c.ghost} barSize={24} radius={[0, 2, 2, 0]}>
                      <LabelList dataKey="value" position="right" fill={c.ink2} fontSize={11} fontFamily={c.mono} formatter={v => `${(v * 100).toFixed(1)}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer style={{ padding: '36px 0 60px', borderTop: `1px solid ${c.line}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <p style={{ fontFamily: c.mono, fontSize: 11, color: c.ink3, letterSpacing: '0.05em' }}>PHANTOM CART · Data-driven case study on cart abandonment behavior</p>
            <span style={{ fontFamily: c.mono, fontSize: 10, color: c.ink3, letterSpacing: '0.08em' }}>CASE CLOSED // 2026</span>
          </div>
          <div style={{ border: `1px dashed ${c.line}`, borderRadius: 2, padding: '14px 16px', color: c.ink3, fontFamily: c.mono, fontSize: 12, lineHeight: 1.5 }}>
            <span style={{ color: c.danger, fontWeight: 600 }}>DISCLOSURE:</span> Built on a public, anonymized e-commerce dataset for academic demonstration. No real client or personal data is represented.
          </div>
        </footer>

      </div>
    </div>
  );
}