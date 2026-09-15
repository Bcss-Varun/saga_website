import styles from './VerticalVisual.module.css';

// Small line icons follow the site's existing stroke vocabulary.
const paths = {
  arrow: 'M4 12h16M14 6l6 6-6 6',
  signal: 'M12 11v2M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14',
  context: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  record: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5',
  media: 'M3 5h18v14H3zM10 9l5 3-5 3z',
  location: 'M12 21s7-6 7-12A7 7 0 0 0 5 9c0 6 7 12 7 12ZM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  network: 'M5 5h4v4H5zM15 4h4v4h-4zM9 16h4v4H9zM9 7h6M7 9l4 7M17 8l-5 8',
  shield: 'M12 3l8 4v6c0 5-8 9-8 9S4 18 4 13V7zM8 12l3 3 5-6',
  settings: 'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7v.2',
  people: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0-2-5M18 20a6 6 0 0 0-1.5-4',
  check: 'M5 12l4 4L19 6',
  chat: 'M20 12a8 8 0 0 1-11 7L4 20l1-5a8 8 0 1 1 15-3Z',
  trend: 'M4 18l6-6 4 2 6-8M14 6h6v6',
};
export function Icon({ name }) {
  return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={paths[name] || paths.context} />
  </svg>;
}
function Label({ icon, title, body, accent }) {
  return <div className={[styles.label, accent ? styles.accent : ''].join(' ')}>
    <Icon name={icon} /><div><strong>{title}</strong>{body && <span>{body}</span>}</div>
  </div>;
}
function Connector() {
  return <div className={styles.connector} aria-hidden="true"><span /><Icon name="arrow" /></div>;
}
function Signal() {
  return <div className={styles.signal}>
    <div className={styles.sourceBox}><span className={styles.kicker}>Your watchlist</span>
      <div className={styles.chips}>{['Terms', 'Entities', 'Subjects'].map(x => <span key={x}>{x}</span>)}</div>
      <p>Native script · Transliteration · Mixed script</p>
    </div>
    <Connector />
    <Label icon="record" title="Matched public signal" body="Post · Account · Term · Capture context" />
    <Connector />
    <Label icon="shield" title="Alert ready for review" body="Priority · Geography · Responsible officer" accent />
    <p className={styles.bottomLine}>The original source stays connected.</p>
  </div>;
}
function Investigation() {
  return <div>
    <div className={styles.network}>
      <svg viewBox="0 0 460 290" preserveAspectRatio="none" aria-hidden="true">
        <path d="M100 55Q230 55 230 145M360 55Q230 55 230 145M95 240Q230 240 230 145M365 240Q230 240 230 145" />
        <circle cx="230" cy="145" r="70" /><circle cx="230" cy="145" r="97" />
      </svg>
      <div className={styles.nodeTopLeft}><Label icon="people" title="Accounts" /></div>
      <div className={styles.nodeTopRight}><Label icon="media" title="Media" /></div>
      <div className={styles.nodeCenter}><Icon name="record" /><strong>Source record</strong></div>
      <div className={styles.nodeBottomLeft}><Label icon="location" title="Locations" /></div>
      <div className={styles.nodeBottomRight}><Label icon="context" title="Context" /></div>
    </div>
    <div className={styles.figureFooter}><span>Explore relationships</span><Icon name="arrow" /><strong>Verify the finding</strong></div>
  </div>;
}
function Geography() {
  return <div className={styles.geo}>
    <svg className={styles.map} viewBox="0 0 460 260" aria-hidden="true">
      <path d="M45 94 122 37 180 62 176 132 110 154 58 137Z" />
      <path d="M122 37 208 23 255 73 225 128 176 132 180 62Z" />
      <path d="M208 23 318 41 332 100 276 140 225 128 255 73Z" />
      <path d="M318 41 389 78 418 141 364 176 304 157 276 140 332 100Z" />
      <path className={styles.mapFocus} d="M110 154 176 132 225 128 249 191 175 229 103 206Z" />
      <path d="M225 128 276 140 304 157 316 229 249 242 175 229 249 191Z" />
      <path d="M304 157 364 176 400 222 316 229Z" />
      <circle cx="179" cy="178" r="9" className={styles.mapPin} />
      <circle cx="179" cy="178" r="20" className={styles.mapHalo} />
      <path className={styles.mapTrail} d="M179 178 275 97 369 134" />
      <circle cx="275" cy="97" r="4" /><circle cx="369" cy="134" r="4" />
    </svg>
    <div className={styles.geoReading}><span className={styles.kicker}>Area context</span>
      <Label icon="location" title="District or constituency" body="Read the area alongside its preceding period." />
      <div className={styles.chips}><span>Sentiment</span><span>Issue velocity</span><span>Source records</span></div>
    </div>
  </div>;
}
function Comparison() {
  return <div>
    <div className={styles.compare}>
      {[['Before the event', 'Establish the context', ['Existing themes', 'Area sentiment', 'Source discussion']], ['After the event', 'Examine the movement', ['Emerging questions', 'Sentiment changes', 'Supporting posts']]].map(([label, title, items]) => (
        <div className={styles.comparePanel} key={label}><span className={styles.kicker}>{label}</span>
          <Icon name="context" /><strong>{title}</strong>
          <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      ))}
    </div>
    <div className={styles.compareRule}><span>Same area</span><span>Same subject</span><span>Comparable periods</span></div>
    <p className={styles.bottomLine}>A change is a finding to examine, not proof of its cause.</p>
  </div>;
}
function Record() {
  return <div className={styles.record}>
    <div className={styles.recordIdentity}><div className={styles.largeIcon}><Icon name="record" /></div>
      <span className={styles.kicker}>Investigative context</span><strong>One connected record</strong><p>From a source finding to the wider case.</p></div>
    <div className={styles.recordFields}>
      {[['people','Accounts & aliases','Known identifiers and candidate relationships'],['media','Original material','Captured posts, images and video'],['location','Source context','Available location and capture metadata'],['record','Case reference','FIR linkage and recorded case activity']].map(([icon,title,body])=><Label key={title} {...{icon,title,body}} />)}
    </div>
  </div>;
}
function Grievance() {
  return <div className={styles.lifecycle}>
    {[['New','Categorise the complaint','Subject · Area · Source'],['In Progress','Route to the owning department','Owner · Status · Time in state'],['Resolved','Record the closure','Action · Closed by · Record']].map(([state,title,body],i)=>(
      <div className={styles.lifecycleStep} key={state}><span className={styles.state}><span />{state}</span>
        <Icon name={['chat','people','check'][i]} /><strong>{title}</strong><p>{body}</p>
        {i<2 && <span className={styles.lifeArrow}><Icon name="arrow" /></span>}
      </div>
    ))}
  </div>;
}
function Trend({ endorsement }) {
  return <div>
    <div className={styles.trendHead}><span className={styles.kicker}>{endorsement ? 'Reputation in context' : 'Conversation dynamics'}</span><Icon name="trend" /></div>
    <svg className={styles.chart} viewBox="0 0 520 220" aria-hidden="true">
      {[40,90,140,190].map(y=><path className={styles.chartGrid} key={y} d={'M20 '+y+'H500'} />)}
      <path className={styles.chartArea} d={endorsement ? 'M20 145C70 145 60 75 125 85S210 160 260 115 330 140 365 90 430 40 500 60V205H20Z' : 'M20 180C75 180 70 171 125 174S200 160 240 157 310 132 350 104 420 88 450 55 480 42 500 24V205H20Z'} />
      <path className={styles.chartLine} d={endorsement ? 'M20 145C70 145 60 75 125 85S210 160 260 115 330 140 365 90 430 40 500 60' : 'M20 180C75 180 70 171 125 174S200 160 240 157 310 132 350 104 420 88 450 55 480 42 500 24'} />
    </svg>
    <div className={styles.trendLabels}>{(endorsement ? ['Project context','Public appearances','Commercial association'] : ['Developing discussion','Changing velocity','Sources driving attention']).map(x=><span key={x}>{x}</span>)}</div>
    <div className={styles.figureFooter}><Icon name="context" /><strong>{endorsement ? 'Examine the events and discussion behind a change.' : 'Open the posts and accounts behind the movement.'}</strong></div>
  </div>;
}
function Clusters() {
  return <div className={styles.cluster}>
    <div className={styles.clusterSources}>{['Public post','Customer concern','Related discussion'].map(x=><Label key={x} title={x} icon="chat" />)}</div>
    <Connector />
    <Label icon="context" title="A connected issue" body="Subject · Available location · Distinct accounts" accent />
    <div className={styles.clusterChecks}><div><Icon name="location" /><strong>Complaint pattern</strong><span>What is being reported?</span></div><div><Icon name="network" /><strong>Activity pattern</strong><span>How is it being amplified?</span></div></div>
  </div>;
}
function Activity() {
  return <div>
    <div className={styles.patterns}>{[['Posting cadence',[2,5,1,4,2,6,3,2,5,1,3,4]],['Repeated bursts',[1,1,6,6,1,1,6,6,1,1,6,6]]].map(([name,bars])=><div key={name} className={styles.pattern}><span>{name}</span><div aria-hidden="true">{bars.map((h,i)=><i key={i} style={{height: h*7+6}} />)}</div></div>)}</div>
    <div className={styles.chips}><span>Account age</span><span>Repeated phrasing</span><span>Burst timing</span></div>
    <Connector /><Label icon="people" title="Analyst interpretation" body="Review the pattern and the actual concern." accent />
    <p className={styles.bottomLine}>Indicators support review. They do not establish identity.</p>
  </div>;
}
function Communities() {
  return <div>
    <div className={styles.community}>
      <svg viewBox="0 0 480 285" aria-hidden="true">
        <ellipse cx="240" cy="142" rx="185" ry="107" /><ellipse cx="240" cy="142" rx="122" ry="65" />
        <path d="M95 80 240 142 375 76M240 142 355 234M240 142 115 227" />
        {[[95,80],[375,76],[355,234],[115,227],[65,170],[420,155],[238,36],[240,249]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i<4?8:4} />)}
      </svg>
      <div className={styles.communityCenter}><Icon name="people" /><strong>Shared support</strong></div>
      <span className={styles.communityTop}>Community conversations</span>
      <span className={styles.communityBottom}>Advocates & amplification</span>
    </div>
    <div className={styles.figureFooter}><strong>Understand who carries the conversation.</strong></div>
  </div>;
}
function Response() {
  return <div className={styles.response}>
    {[['context','Issue to review','Conversation or complaint cluster'],['people','Assigned owner','Responsibility for the next action'],['chat','Recorded response','Statements and timestamps'],['record','Case review','Sequence and response history']].map(([icon,title,body])=><Label key={title} {...{icon,title,body}} />)}
  </div>;
}
function Brief({ type }) {
  const rows = type === 'brandBrief' ? [
    ['Conversation','Narrative and sources driving attention'],['Complaint pattern','Subject, context and available location'],['Response record','Ownership, statements and timestamps']
  ] : type === 'talentBrief' ? [
    ['Context','Projects, appearances and associations'],['Community','Support and amplified conversation'],['Reputation trend','Relevant movement and associated events']
  ] : [
    ['Local movement','Areas to review and the issue behind each'],['Discussion','Narratives and coordination indicators'],['Follow-up','Open grievances and responsible departments']
  ];
  return <div className={styles.brief}>
    <div className={styles.briefTop}><Icon name="record" /><span className={styles.kicker}>Blura SAGA · {type==='briefing'?'Intelligence briefing':'Connected context'}</span></div>
    {rows.map(([title,body],i)=><div key={title} className={styles.briefRow}><Icon name={['location','chat','record'][i]} /><div><strong>{title}</strong><p>{body}</p></div></div>)}
    <div className={styles.sourceFoot}><Icon name="network" /><span>Findings stay connected to the source.</span></div>
  </div>;
}
export default function VerticalVisual({ type, title, wide }) {
  const diagrams = {
    signal: <Signal />, investigation: <Investigation />, geography: <Geography />,
    comparison: <Comparison />, record: <Record />, grievance: <Grievance />,
    trend: <Trend />, endorsement: <Trend endorsement />, clusters: <Clusters />,
    activity: <Activity />, communities: <Communities />, response: <Response />,
    briefing: <Brief type="briefing" />, brandBrief: <Brief type="brandBrief" />, talentBrief: <Brief type="talentBrief" />,
  };
  return <figure className={[styles.figure, wide ? styles.wide : ''].join(' ')}>
    <div className={styles.figureHead}><span className={styles.figureDot} /><span>Illustrative {['trend','endorsement','activity'].includes(type)?'pattern':'workflow'}</span></div>
    <div className={styles.canvas}>{diagrams[type]}</div>
    <figcaption>{title}</figcaption>
  </figure>;
}
