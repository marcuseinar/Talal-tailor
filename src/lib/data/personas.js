/**
 * Fictional candidate personas used to seed the demo.
 *
 * Every person, company and reference here is invented. The CV bodies are
 * written out in full because the PDF generator renders them into real,
 * downloadable documents — this is the single source of truth for both the
 * candidate profile in the app and the PDF on disk.
 */

export const PERSONAS = [
  {
    id: 'amira-haddad',
    firstName: 'Amira',
    lastName: 'Haddad',
    pronouns: 'she/her',
    headline: 'Frontend engineer — realtime interfaces, design systems',
    email: 'amira.haddad@example.com',
    phone: '+46 70 555 01 22',
    location: 'Stockholm, Sweden',
    avatarSeed: 'Amira',
    jobId: 'senior-frontend-engineer',
    stage: 'interview',
    source: 'Referral',
    referredBy: 'Jonas Hedlund (Engineering)',
    appliedAt: '2026-08-21',
    starred: true,
    unread: false,
    tags: ['Svelte', 'WebGL', 'Strong referral'],
    links: { portfolio: 'amira.example', github: 'github.example/amira-h', linkedin: 'in.example/amirahaddad' },
    salaryExpectation: '74 000 SEK / month',
    noticePeriod: '3 months',
    workPermit: 'Swedish citizen',
    summary:
      'Frontend engineer with eight years on data-dense products. I care about ' +
      'the unglamorous half of the craft: render budgets, focus order, what the ' +
      'screen does when the socket drops. Most recently led the rewrite of a ' +
      'trading terminal used by 400 daily operators.',
    experience: [
      {
        role: 'Lead Frontend Engineer',
        company: 'Nordbit Trading',
        period: '2022 — present',
        location: 'Stockholm',
        bullets: [
          'Led a five-person rewrite of the order terminal from Angular to Svelte, cutting p95 interaction latency from 180ms to 34ms.',
          'Designed the realtime layer over WebSocket with backpressure and replay, surviving a venue outage without a client-side reload.',
          'Took the product from WCAG 2.1 A to AA, including a full keyboard path through the order ticket.'
        ]
      },
      {
        role: 'Senior Frontend Engineer',
        company: 'Kartograf',
        period: '2019 — 2022',
        location: 'Stockholm',
        bullets: [
          'Built the WebGL rendering layer for a mapping product handling 2M features per viewport.',
          'Owned the component library used by four product teams; introduced visual regression testing.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'Tvillingbyrån',
        period: '2017 — 2019',
        location: 'Malmö',
        bullets: ['Agency work across twelve client products — React, Vue and a lot of legacy jQuery rescue.']
      }
    ],
    education: [
      { degree: 'MSc Computer Science', school: 'KTH Royal Institute of Technology', period: '2012 — 2017' }
    ],
    skills: ['TypeScript', 'Svelte', 'React', 'WebGL', 'WebSockets', 'Accessibility', 'Performance profiling', 'Playwright'],
    languages: [
      { name: 'Swedish', level: 'Native' },
      { name: 'Arabic', level: 'Native' },
      { name: 'English', level: 'Fluent' }
    ],
    coverLetter:
      'Jonas mentioned you are rebuilding the control room and that the alarm ' +
      'surface is the hard part. That is exactly the problem I spent three years ' +
      'on at Nordbit — the difference between an operator noticing a fault and ' +
      'missing it is almost never the model, it is the four hundred milliseconds ' +
      'and the contrast ratio. I would like to work on it in a domain that ' +
      'matters more than basis points.',
    scorecards: [
      {
        id: 'sc-amira-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-26',
        criteria: { craft: 5, problem: 4, communication: 5, ownership: 4, collaboration: 4 },
        comment: 'Clearest screening call I have had this quarter. Knows exactly what she wants to work on and asked sharper questions than I did.'
      },
      {
        id: 'sc-amira-2', author: 'Talal', stage: 'interview', date: '2026-09-04',
        criteria: { craft: 5, problem: 5, communication: 4, ownership: 5, collaboration: 4 },
        comment: 'Walked through the Nordbit backpressure design on a whiteboard without notes. Pushed back on my framing of the alarm problem and was right to.'
      }
    ],
    notes: [
      { id: 'n-amira-1', author: 'Talal', at: '2026-09-04T15:20:00Z', body: 'Competing process at Klarna, final stage. We need to move — case study this week or we lose her.' },
      { id: 'n-amira-2', author: 'Saga Wikström', at: '2026-09-08T08:05:00Z', body: 'Case scheduled for the 17th. Confirmed she can do 3 months notice, possibly 2 if we push.' }
    ]
  },
  {
    id: 'bjorn-lindqvist',
    firstName: 'Björn',
    lastName: 'Lindqvist',
    pronouns: 'he/him',
    headline: 'Data engineer — streaming, dbt, cost control',
    email: 'bjorn.lindqvist@example.com',
    phone: '+46 73 555 88 41',
    location: 'Uppsala, Sweden',
    avatarSeed: 'Bjorn',
    jobId: 'data-engineer',
    stage: 'case',
    source: 'LinkedIn',
    appliedAt: '2026-08-12',
    starred: false,
    unread: false,
    tags: ['Kafka', 'dbt', 'Cost optimisation'],
    links: { github: 'github.example/blindqvist', linkedin: 'in.example/bjornlindqvist' },
    salaryExpectation: '68 000 SEK / month',
    noticePeriod: '2 months',
    workPermit: 'Swedish citizen',
    summary:
      'Data engineer who came up through operations, which is why I am unusually ' +
      'interested in what a pipeline costs and what it does at 04:00 on a bank ' +
      'holiday. Six years across telco and logistics, most of it on time-series.',
    experience: [
      {
        role: 'Senior Data Engineer',
        company: 'Frakt Nordic',
        period: '2021 — present',
        location: 'Uppsala',
        bullets: [
          'Rebuilt the telemetry ingest for 14 000 vehicles on Kafka + Flink, replacing a batch job that ran four hours late.',
          'Introduced dbt and data contracts across 180 models; schema-drift incidents went from roughly two a month to zero in nine months.',
          'Cut Snowflake spend 41% by reworking clustering keys and killing eleven unused models.'
        ]
      },
      {
        role: 'Data Engineer',
        company: 'Telia Analytics (contract)',
        period: '2019 — 2021',
        location: 'Stockholm',
        bullets: [
          'Airflow pipelines over network-quality telemetry; on-call for the reporting stack.',
          'Built the reconciliation layer that finally made two billing systems agree.'
        ]
      }
    ],
    education: [
      { degree: 'BSc Information Systems', school: 'Uppsala University', period: '2015 — 2018' }
    ],
    skills: ['Python', 'SQL', 'dbt', 'Airflow', 'Kafka', 'Flink', 'Snowflake', 'Terraform'],
    languages: [
      { name: 'Swedish', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'German', level: 'Conversational' }
    ],
    coverLetter:
      'I have spent two years making somebody else\'s freight telemetry arrive on ' +
      'time and I would rather do it for the grid. The forecasting problem is ' +
      'more interesting than the routing one and the consequences of a stale ' +
      'feature table are real. I am also, for what it is worth, the person who ' +
      'reads the warehouse bill line by line.',
    scorecards: [
      {
        id: 'sc-bjorn-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-18',
        criteria: { craft: 4, problem: 4, communication: 3, ownership: 5, collaboration: 3 },
        comment: 'Very solid. Quiet in conversation but every answer landed. Ops instincts are exactly what the team is missing.'
      },
      {
        id: 'sc-bjorn-2', author: 'Talal', stage: 'interview', date: '2026-08-29',
        criteria: { craft: 4, problem: 4, communication: 3, ownership: 5, collaboration: 4 },
        comment: 'Good systems thinking on the data-contract question. Would like to see how he writes actual SQL before we commit — hence the case.'
      }
    ],
    notes: [
      { id: 'n-bjorn-1', author: 'Talal', at: '2026-08-29T16:40:00Z', body: 'Sending the freshness/backfill case. Give him a week, he has a newborn.' },
      { id: 'n-bjorn-2', author: 'Saga Wikström', at: '2026-09-11T09:12:00Z', body: 'Case submitted early. Review booked with Talal for the 16th.' }
    ]
  },
  {
    id: 'ngozi-okafor',
    firstName: 'Ngozi',
    lastName: 'Okafor',
    pronouns: 'she/her',
    headline: 'Product designer — industrial and safety-critical interfaces',
    email: 'ngozi.okafor@example.com',
    phone: '+353 86 555 2210',
    location: 'Dublin, Ireland',
    avatarSeed: 'Ngozi',
    jobId: 'product-designer',
    stage: 'offer',
    source: 'Sourced',
    appliedAt: '2026-08-05',
    starred: true,
    unread: false,
    tags: ['Research-led', 'Design systems', 'Top of pipeline'],
    links: { portfolio: 'ngozi.example', linkedin: 'in.example/ngoziokafor' },
    salaryExpectation: '€70 000 / year',
    noticePeriod: '1 month',
    workPermit: 'EU citizen',
    summary:
      'Product designer with seven years on interfaces where being wrong has a ' +
      'cost — rail signalling, then hospital logistics. I do field research ' +
      'first and open Figma second, and I build my own prototypes because ' +
      'hand-off documents lie.',
    experience: [
      {
        role: 'Senior Product Designer',
        company: 'Meridian Health Logistics',
        period: '2022 — present',
        location: 'Dublin',
        bullets: [
          'Redesigned the theatre-scheduling surface used by nine hospitals; late-start incidents attributable to the tool dropped by roughly a third.',
          'Built and maintained a 60-component accessible design system in Figma with a coded reference implementation.',
          'Ran 40+ contextual interviews on ward floors — most of the design decisions came straight out of them.'
        ]
      },
      {
        role: 'Product Designer',
        company: 'Iarnród Digital',
        period: '2019 — 2022',
        location: 'Dublin',
        bullets: [
          'Designed dispatcher tooling for regional rail, including the alarm taxonomy still in use.',
          'Introduced the first usability testing programme the team had ever run.'
        ]
      }
    ],
    education: [
      { degree: 'MA Interaction Design', school: 'National College of Art and Design', period: '2016 — 2018' },
      { degree: 'BSc Psychology', school: 'University College Dublin', period: '2012 — 2016' }
    ],
    skills: ['Figma', 'Design systems', 'Contextual inquiry', 'Usability testing', 'HTML/CSS prototyping', 'WCAG 2.2', 'Information architecture'],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Igbo', level: 'Native' },
      { name: 'French', level: 'Conversational' }
    ],
    coverLetter:
      'Your posting says "design for operators, not for dribbble", which is the ' +
      'first honest sentence I have read in a design job ad this year. I have ' +
      'spent seven years designing for people who cannot close the tab and walk ' +
      'away. The alarm work at Iarnród is the closest thing in my portfolio to ' +
      'what you are describing, and I would be glad to walk you through where it ' +
      'went wrong before it went right.',
    scorecards: [
      {
        id: 'sc-ngozi-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-10',
        criteria: { craft: 5, problem: 5, communication: 5, ownership: 4, collaboration: 5 },
        comment: 'Exceptional. Portfolio walk-through was mostly about failures and what she changed, which is rarer than it should be.'
      },
      {
        id: 'sc-ngozi-2', author: 'Talal', stage: 'interview', date: '2026-08-20',
        criteria: { craft: 5, problem: 5, communication: 5, ownership: 5, collaboration: 5 },
        comment: 'Best designer we have interviewed. Full stop. She reframed the dispatch problem in a way I have been repeating in other meetings since.'
      },
      {
        id: 'sc-ngozi-3', author: 'Mira Chandrasekhar', stage: 'case', date: '2026-09-01',
        criteria: { craft: 5, problem: 4, communication: 5, ownership: 4, collaboration: 5 },
        comment: 'Case was tight and she prototyped it in code. One gap: light on motion. Not a blocker.'
      }
    ],
    notes: [
      { id: 'n-ngozi-1', author: 'Talal', at: '2026-09-02T10:00:00Z', body: 'Unanimous yes. Taking to comp committee.' },
      { id: 'n-ngozi-2', author: 'Talal', at: '2026-09-09T13:30:00Z', body: 'Offer out at €70k + equity. She asked for 48h. Deadline Friday.' }
    ]
  },
  {
    id: 'tomas-ferreira',
    firstName: 'Tomás',
    lastName: 'Ferreira',
    pronouns: 'he/him',
    headline: 'Frontend engineer — React, testing, developer tooling',
    email: 'tomas.ferreira@example.com',
    phone: '+351 91 555 4417',
    location: 'Porto, Portugal',
    avatarSeed: 'Tomas',
    jobId: 'senior-frontend-engineer',
    stage: 'screening',
    source: 'Careers site',
    appliedAt: '2026-09-02',
    starred: false,
    unread: false,
    tags: ['React', 'Remote-first'],
    links: { github: 'github.example/tferreira', linkedin: 'in.example/tomasferreira' },
    salaryExpectation: '€65 000 / year',
    noticePeriod: '1 month',
    workPermit: 'EU citizen — would need remote arrangement',
    summary:
      'Six years of frontend, the last three of them mostly on the tooling and ' +
      'test infrastructure that let a 30-engineer org ship twice a day. Strong ' +
      'React, learning Svelte in my own time and enjoying it more than I expected.',
    experience: [
      {
        role: 'Frontend Platform Engineer',
        company: 'Vinha Software',
        period: '2022 — present',
        location: 'Porto',
        bullets: [
          'Owned the build and test platform for a 30-engineer frontend org; cut CI wall time from 22 to 7 minutes.',
          'Wrote the component testing standards and the codemods that migrated 400 existing tests.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'Bica Digital',
        period: '2020 — 2022',
        location: 'Lisbon',
        bullets: ['Product work on a booking platform — React, TypeScript, a little React Native.']
      }
    ],
    education: [{ degree: 'BSc Informatics Engineering', school: 'University of Porto', period: '2016 — 2020' }],
    skills: ['React', 'TypeScript', 'Vite', 'Playwright', 'Testing Library', 'CI/CD', 'Svelte (learning)'],
    languages: [
      { name: 'Portuguese', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Spanish', level: 'Fluent' }
    ],
    coverLetter:
      'I am applying knowing the role says Stockholm hybrid and I am in Porto. If ' +
      'that is genuinely fixed, no hard feelings. If there is room for a remote ' +
      'arrangement with regular travel, I think the platform and tooling side of ' +
      'what you are describing is underserved and I would be good at it.',
    scorecards: [
      {
        id: 'sc-tomas-1', author: 'Saga Wikström', stage: 'screening', date: '2026-09-09',
        criteria: { craft: 4, problem: 4, communication: 4, ownership: 4, collaboration: 4 },
        comment: 'Genuinely strong on tooling. The location question is the whole question — flagged to Talal.'
      }
    ],
    notes: [
      { id: 'n-tomas-1', author: 'Saga Wikström', at: '2026-09-09T11:15:00Z', body: 'Talal — do we have any flex on Stockholm for this req? He is good enough to be worth the exception conversation.' }
    ]
  },
  {
    id: 'elsa-norberg',
    firstName: 'Elsa',
    lastName: 'Norberg',
    pronouns: 'she/her',
    headline: 'Talent partner — engineering hiring at scale-ups',
    email: 'elsa.norberg@example.com',
    phone: '+46 76 555 30 08',
    location: 'Stockholm, Sweden',
    avatarSeed: 'Elsa',
    jobId: 'talent-partner',
    stage: 'inbox',
    source: 'LinkedIn',
    appliedAt: '2026-09-12',
    starred: false,
    unread: true,
    tags: ['Scale-up', 'Structured hiring'],
    links: { linkedin: 'in.example/elsanorberg' },
    salaryExpectation: '56 000 SEK / month',
    noticePeriod: '3 months',
    workPermit: 'Swedish citizen',
    summary:
      'In-house tech recruiter, five years, two scale-ups. I have taken one ' +
      'company from 40 to 160 and I have the scar tissue to show for it. I am ' +
      'happiest when I am allowed to redesign the process rather than just run it.',
    experience: [
      {
        role: 'Talent Partner, Engineering',
        company: 'Rebro',
        period: '2023 — present',
        location: 'Stockholm',
        bullets: [
          'Owned 8–10 concurrent engineering reqs; median time-to-offer 21 days against a 40-day baseline.',
          'Replaced unstructured panels with interview kits and scorecards across all engineering roles.',
          'Built the referral programme that now accounts for 28% of engineering hires.'
        ]
      },
      {
        role: 'Technical Recruiter',
        company: 'Fältkraft',
        period: '2021 — 2023',
        location: 'Stockholm',
        bullets: ['Full-cycle hiring across engineering and data. Grew the team from 40 to 160 people over two years.']
      }
    ],
    education: [{ degree: 'BA Human Resource Management', school: 'Stockholm University', period: '2016 — 2019' }],
    skills: ['Full-cycle recruitment', 'Interview kit design', 'Sourcing', 'Employer branding', 'Funnel analytics', 'Teamtailor', 'Greenhouse'],
    languages: [
      { name: 'Swedish', level: 'Native' },
      { name: 'English', level: 'Fluent' }
    ],
    coverLetter:
      'Your ad says "coach managers out of gut-feel hiring", which suggests you ' +
      'already know where the problem is. That is the part of the job I actually ' +
      'want. I have done the 40-to-160 version of this once and I would like to ' +
      'do it again somewhere the product is worth the effort.',
    scorecards: [],
    notes: []
  },
  {
    id: 'dmitri-volkov',
    firstName: 'Dmitri',
    lastName: 'Volkov',
    pronouns: 'he/him',
    headline: 'Data engineer — batch ETL, reporting warehouses',
    email: 'dmitri.volkov@example.com',
    phone: '+371 2 555 1180',
    location: 'Riga, Latvia',
    avatarSeed: 'Dmitri',
    jobId: 'data-engineer',
    stage: 'inbox',
    source: 'Job board',
    appliedAt: '2026-09-13',
    starred: false,
    unread: true,
    tags: ['SQL', 'Relocating'],
    links: { linkedin: 'in.example/dmitrivolkov' },
    salaryExpectation: '55 000 SEK / month',
    noticePeriod: '1 month',
    workPermit: 'EU citizen',
    summary:
      'Four years building reporting warehouses for retail and insurance. Very ' +
      'strong SQL, comfortable with Airflow, currently learning dbt properly ' +
      'rather than pretending I already know it.',
    experience: [
      {
        role: 'Data Engineer',
        company: 'Baltijas Apdrošināšana',
        period: '2022 — present',
        location: 'Riga',
        bullets: [
          'Own the nightly claims and policy warehouse load — 200+ tables, 4-hour window, no missed SLA in 14 months.',
          'Migrated the reporting layer from stored procedures to Airflow-orchestrated Python.'
        ]
      },
      {
        role: 'BI Developer',
        company: 'Rimi Analytics',
        period: '2020 — 2022',
        location: 'Riga',
        bullets: ['Built and maintained the merchandising reporting suite used by 300 store managers.']
      }
    ],
    education: [{ degree: 'BSc Computer Science', school: 'University of Latvia', period: '2016 — 2020' }],
    skills: ['SQL', 'Python', 'Airflow', 'PostgreSQL', 'Power BI', 'dbt (learning)'],
    languages: [
      { name: 'Latvian', level: 'Native' },
      { name: 'Russian', level: 'Native' },
      { name: 'English', level: 'Professional' }
    ],
    coverLetter:
      'I am looking to move to Stockholm and I am looking for work with a bit ' +
      'more engineering in it than insurance reporting allows. I know my ' +
      'streaming experience is thin — that is honestly part of why I want the ' +
      'role. Everything else on your list I have done in production.',
    scorecards: [],
    notes: []
  },
  {
    id: 'leila-nasser',
    firstName: 'Leila',
    lastName: 'Nasser',
    pronouns: 'she/her',
    headline: 'Customer success — enterprise SaaS, DACH market',
    email: 'leila.nasser@example.com',
    phone: '+49 151 555 7702',
    location: 'Berlin, Germany',
    avatarSeed: 'Leila',
    jobId: 'customer-success-manager',
    stage: 'interview',
    source: 'Referral',
    referredBy: 'Katrin Vogel (Revenue)',
    appliedAt: '2026-08-25',
    starred: false,
    unread: false,
    tags: ['DACH', 'Enterprise renewals'],
    links: { linkedin: 'in.example/leilanasser' },
    salaryExpectation: '€72 000 OTE',
    noticePeriod: '3 months',
    workPermit: 'German citizen',
    summary:
      'Five years of customer success in enterprise SaaS, the last three owning ' +
      'DACH utilities and municipal accounts. I am the CSM who reads the product ' +
      'analytics before the call rather than during it.',
    experience: [
      {
        role: 'Senior Customer Success Manager',
        company: 'Stadtwerk Cloud',
        period: '2023 — present',
        location: 'Berlin',
        bullets: [
          'Own 15 municipal utility accounts worth €3.1M ARR; net revenue retention 118% last year.',
          'Turned around two accounts flagged for churn by rebuilding their onboarding from scratch.',
          'Built the adoption scoring model the whole CS team now runs on.'
        ]
      },
      {
        role: 'Customer Success Manager',
        company: 'Logibahn',
        period: '2021 — 2023',
        location: 'Munich',
        bullets: ['Mid-market logistics accounts across DACH. Ran onboarding for 40+ customers.']
      }
    ],
    education: [{ degree: 'BA Business Administration', school: 'Freie Universität Berlin', period: '2016 — 2020' }],
    skills: ['Account management', 'Onboarding design', 'SQL (basic)', 'Renewal negotiation', 'QBR facilitation', 'Salesforce', 'Gainsight'],
    languages: [
      { name: 'German', level: 'Native' },
      { name: 'Arabic', level: 'Native' },
      { name: 'English', level: 'Fluent' }
    ],
    coverLetter:
      'I have spent three years explaining cloud software to people who have run ' +
      'the same dispatch process since 1994, and I have learned that the ' +
      'conversation only works if you can show them their own numbers. Katrin ' +
      'said that is roughly your thesis too.',
    scorecards: [
      {
        id: 'sc-leila-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-31',
        criteria: { craft: 4, problem: 4, communication: 5, ownership: 4, collaboration: 4 },
        comment: 'Strong DACH utility knowledge, which is the scarce thing here. Very polished communicator.'
      }
    ],
    notes: [
      { id: 'n-leila-1', author: 'Saga Wikström', at: '2026-09-07T14:00:00Z', body: 'Panel booked 18 Sept with Katrin and Talal. Flag: 3 month notice, and she has a competing conversation at Enpal.' }
    ]
  },
  {
    id: 'mika-virtanen',
    firstName: 'Mika',
    lastName: 'Virtanen',
    pronouns: 'they/them',
    headline: 'Product designer — B2B tools, motion, prototyping',
    email: 'mika.virtanen@example.com',
    phone: '+358 40 555 9931',
    location: 'Helsinki, Finland',
    avatarSeed: 'Mika',
    jobId: 'product-designer',
    stage: 'rejected',
    rejectionReason: 'Stronger candidates in process',
    source: 'Careers site',
    appliedAt: '2026-08-08',
    starred: false,
    unread: false,
    tags: ['Motion', 'Prototyping'],
    links: { portfolio: 'mika.example', linkedin: 'in.example/mikavirtanen' },
    salaryExpectation: '€64 000 / year',
    noticePeriod: '2 months',
    workPermit: 'EU citizen',
    summary:
      'Product designer, five years, mostly B2B tooling. My strength is motion ' +
      'and prototyping — making a flow feel obvious before anybody writes code.',
    experience: [
      {
        role: 'Product Designer',
        company: 'Sisu Tools',
        period: '2022 — present',
        location: 'Helsinki',
        bullets: [
          'Design lead on a project-management product used by 12 000 teams.',
          'Built the motion system and the prototyping practice the team now uses for every feature.'
        ]
      },
      {
        role: 'UI Designer',
        company: 'Pohjola Digital',
        period: '2020 — 2022',
        location: 'Tampere',
        bullets: ['Client work across banking and retail.']
      }
    ],
    education: [{ degree: 'BA Design', school: 'Aalto University', period: '2016 — 2020' }],
    skills: ['Figma', 'Motion design', 'Prototyping', 'Design systems', 'After Effects', 'Rive'],
    languages: [
      { name: 'Finnish', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Swedish', level: 'Conversational' }
    ],
    coverLetter:
      'I would like to design something with more consequence than another kanban ' +
      'board. My portfolio is B2B tooling rather than industrial, but the ' +
      'underlying problem — dense information, expert users, no tolerance for ' +
      'ambiguity — is the same one I have been working on for five years.',
    scorecards: [
      {
        id: 'sc-mika-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-14',
        criteria: { craft: 4, problem: 3, communication: 4, ownership: 3, collaboration: 4 },
        comment: 'Lovely craft, genuinely good motion work. Research practice is thin and that is the core of this role.'
      },
      {
        id: 'sc-mika-2', author: 'Mira Chandrasekhar', stage: 'interview', date: '2026-08-24',
        criteria: { craft: 4, problem: 3, communication: 4, ownership: 3, collaboration: 4 },
        comment: 'Same read as Saga. Strong visual designer, but could not describe a time research changed their mind.'
      }
    ],
    notes: [
      { id: 'n-mika-1', author: 'Talal', at: '2026-09-02T09:00:00Z', body: 'Rejecting — Ngozi is simply further along on the research side. Mika is worth keeping warm for a mid-level opening next year.' }
    ]
  },
  {
    id: 'rahul-deshpande',
    firstName: 'Rahul',
    lastName: 'Deshpande',
    pronouns: 'he/him',
    headline: 'Frontend engineer — Vue, dashboards, charting',
    email: 'rahul.deshpande@example.com',
    phone: '+46 72 555 6640',
    location: 'Gothenburg, Sweden',
    avatarSeed: 'Rahul',
    jobId: 'senior-frontend-engineer',
    stage: 'inbox',
    source: 'Careers site',
    appliedAt: '2026-09-14',
    starred: false,
    unread: true,
    tags: ['Vue', 'D3'],
    links: { github: 'github.example/rdeshpande', portfolio: 'rahul.example' },
    salaryExpectation: '66 000 SEK / month',
    noticePeriod: '2 months',
    workPermit: 'Swedish work permit, valid to 2029',
    summary:
      'Seven years of frontend, most of it building analytics dashboards. I have ' +
      'written more D3 than is probably healthy and I have strong opinions about ' +
      'when not to use it.',
    experience: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Volvo Connected Solutions',
        period: '2021 — present',
        location: 'Gothenburg',
        bullets: [
          'Built the fleet-analytics dashboard used by 900 operators across 30 markets.',
          'Introduced a charting abstraction over D3 that cut new-chart delivery from days to hours.',
          'Owned the internationalisation work across 14 locales including RTL.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'Infostretch',
        period: '2018 — 2021',
        location: 'Pune, India',
        bullets: ['Client delivery on enterprise Vue and Angular applications.']
      }
    ],
    education: [{ degree: 'BE Computer Engineering', school: 'Savitribai Phule Pune University', period: '2014 — 2018' }],
    skills: ['Vue', 'TypeScript', 'D3', 'Canvas', 'i18n / RTL', 'Vitest', 'Storybook'],
    languages: [
      { name: 'Marathi', level: 'Native' },
      { name: 'Hindi', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Swedish', level: 'Basic' }
    ],
    coverLetter:
      'Your job ad mentions data visualisation "beyond a charting library", which ' +
      'I read as a warning and an invitation. I have built the abstraction layer ' +
      'twice and learned the second time that the interesting part is the ' +
      'interaction model, not the rendering. Happy to show you both versions.',
    scorecards: [],
    notes: []
  },
  {
    id: 'elena-rossi',
    firstName: 'Elena',
    lastName: 'Rossi',
    pronouns: 'she/her',
    headline: 'Customer success — mid-market SaaS, onboarding specialist',
    email: 'elena.rossi@example.com',
    phone: '+39 34 555 1093',
    location: 'Milan, Italy',
    avatarSeed: 'Elena',
    jobId: 'customer-success-manager',
    stage: 'screening',
    source: 'Job board',
    appliedAt: '2026-09-05',
    starred: false,
    unread: false,
    tags: ['Onboarding', 'No German'],
    links: { linkedin: 'in.example/elenarossi' },
    salaryExpectation: '€66 000 OTE',
    noticePeriod: '2 months',
    workPermit: 'EU citizen',
    summary:
      'Four years in customer success for mid-market SaaS, specialising in the ' +
      'first ninety days. I like the unglamorous work of getting a team to ' +
      'actually change how they operate.',
    experience: [
      {
        role: 'Customer Success Manager',
        company: 'Fattura Cloud',
        period: '2022 — present',
        location: 'Milan',
        bullets: [
          'Own onboarding for all new mid-market accounts — 60+ per year.',
          'Cut median time-to-first-value from 47 days to 19 by rebuilding the onboarding sequence.'
        ]
      },
      {
        role: 'Account Manager',
        company: 'Tecnopolo',
        period: '2020 — 2022',
        location: 'Bologna',
        bullets: ['Managed 30 SME accounts through renewal and expansion.']
      }
    ],
    education: [{ degree: 'MA International Management', school: 'Università Bocconi', period: '2017 — 2020' }],
    skills: ['Onboarding design', 'Account management', 'HubSpot', 'Customer analytics', 'Renewals'],
    languages: [
      { name: 'Italian', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'German', level: 'Basic — A2' }
    ],
    coverLetter:
      'I will be upfront: my German is A2 and your ad asks for C2. I am applying ' +
      'because the rest of the role is exactly what I do, and because I am ' +
      'already studying — but I would rather you rule me out now than in week ' +
      'three.',
    scorecards: [
      {
        id: 'sc-elena-1', author: 'Saga Wikström', stage: 'screening', date: '2026-09-10',
        criteria: { craft: 4, problem: 4, communication: 4, ownership: 4, collaboration: 4 },
        comment: 'Genuinely good CSM and refreshingly honest about the language gap. But the gap is real — this book of business is German-speaking.'
      }
    ],
    notes: [
      { id: 'n-elena-1', author: 'Saga Wikström', at: '2026-09-10T15:45:00Z', body: 'Talal: worth considering for the second CSM opening if we scope one to Nordics/Benelux instead? Otherwise this is a no on language.' }
    ]
  },
  {
    id: 'kwame-mensah',
    firstName: 'Kwame',
    lastName: 'Mensah',
    pronouns: 'he/him',
    headline: 'Data engineer — streaming platforms, Kubernetes',
    email: 'kwame.mensah@example.com',
    phone: '+44 7700 555812',
    location: 'London, United Kingdom',
    avatarSeed: 'Kwame',
    jobId: 'data-engineer',
    stage: 'screening',
    source: 'Sourced',
    appliedAt: '2026-09-01',
    starred: true,
    unread: false,
    tags: ['Kafka', 'Platform', 'Visa needed'],
    links: { github: 'github.example/kmensah', linkedin: 'in.example/kwamemensah' },
    salaryExpectation: '72 000 SEK / month',
    noticePeriod: '1 month',
    workPermit: 'UK citizen — would need Swedish work permit',
    summary:
      'Eight years across data and platform engineering. I have run Kafka at a ' +
      'scale where the interesting failures are not in the docs, and I have ' +
      'carried the pager for it.',
    experience: [
      {
        role: 'Staff Data Platform Engineer',
        company: 'Ledgerworks',
        period: '2021 — present',
        location: 'London',
        bullets: [
          'Own the streaming platform — 40 billion events/day across 200 topics, 99.98% availability.',
          'Built the self-serve pipeline framework that took new-pipeline setup from two weeks to an afternoon.',
          'Ran the migration off self-managed Kafka onto MSK with zero consumer downtime.'
        ]
      },
      {
        role: 'Data Engineer',
        company: 'Ocado Technology',
        period: '2018 — 2021',
        location: 'Hatfield',
        bullets: ['Warehouse robotics telemetry pipelines. Time-series at high cardinality.']
      }
    ],
    education: [{ degree: 'MEng Computing', school: 'Imperial College London', period: '2014 — 2018' }],
    skills: ['Kafka', 'Kubernetes', 'Python', 'Scala', 'Flink', 'Terraform', 'Prometheus', 'dbt'],
    languages: [
      { name: 'English', level: 'Native' },
      { name: 'Twi', level: 'Native' }
    ],
    coverLetter:
      'Saga reached out about the data engineer role. I will be honest that on ' +
      'paper it is a step sideways in scope for me, but the domain is a step up ' +
      'in interest and I am done optimising ad-tech throughput. If there is room ' +
      'for the role to grow into platform ownership, I am very interested.',
    scorecards: [
      {
        id: 'sc-kwame-1', author: 'Saga Wikström', stage: 'screening', date: '2026-09-08',
        criteria: { craft: 5, problem: 5, communication: 4, ownership: 5, collaboration: 4 },
        comment: 'Strongest technical screen on this req by some distance. Real question is whether the role is big enough for him — and the permit timeline.'
      }
    ],
    notes: [
      { id: 'n-kwame-1', author: 'Talal', at: '2026-09-09T08:30:00Z', body: 'Permit is ~8 weeks via the fast track. Worth it. Booking the panel — and I want to talk to him about scoping this closer to platform.' }
    ]
  },
  {
    id: 'ingrid-solberg',
    firstName: 'Ingrid',
    lastName: 'Solberg',
    pronouns: 'she/her',
    headline: 'Product designer — service design, public sector',
    email: 'ingrid.solberg@example.com',
    phone: '+47 45 555 219',
    location: 'Oslo, Norway',
    avatarSeed: 'Ingrid',
    jobId: 'product-designer',
    stage: 'inbox',
    source: 'Event',
    appliedAt: '2026-09-11',
    starred: false,
    unread: true,
    tags: ['Service design', 'Met at UX Nordic'],
    links: { portfolio: 'ingrid.example', linkedin: 'in.example/ingridsolberg' },
    salaryExpectation: '€68 000 / year',
    noticePeriod: '3 months',
    workPermit: 'Norwegian citizen — EU/EEA',
    summary:
      'Service designer turned product designer. Six years, mostly public sector ' +
      'digital services, which means I have designed for people who have no ' +
      'choice but to use the thing.',
    experience: [
      {
        role: 'Senior Designer',
        company: 'Digdir (Norwegian Digitalisation Agency)',
        period: '2022 — present',
        location: 'Oslo',
        bullets: [
          'Led design on a benefits-application service used by 400 000 people a year.',
          'Ran the accessibility programme — WCAG 2.2 AA compliance across eleven services.'
        ]
      },
      {
        role: 'Service Designer',
        company: 'Halogen',
        period: '2019 — 2022',
        location: 'Oslo',
        bullets: ['Consultancy work across health, transport and municipal services.']
      }
    ],
    education: [{ degree: 'MA Service Design', school: 'Oslo School of Architecture and Design', period: '2017 — 2019' }],
    skills: ['Service design', 'Figma', 'Accessibility (WCAG 2.2)', 'Journey mapping', 'Qualitative research', 'Workshop facilitation'],
    languages: [
      { name: 'Norwegian', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Swedish', level: 'Fluent' }
    ],
    coverLetter:
      'We spoke briefly at UX Nordic in Malmö — I was the one arguing with you ' +
      'about alarm fatigue over coffee. You said to apply, so here I am. My ' +
      'background is public sector rather than industrial, but the constraint is ' +
      'the same: the user cannot leave, so the design has to be right.',
    scorecards: [],
    notes: []
  },
  {
    id: 'yuki-tanaka',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    pronouns: 'she/her',
    headline: 'Frontend engineer — accessibility specialist',
    email: 'yuki.tanaka@example.com',
    phone: '+46 79 555 4412',
    location: 'Stockholm, Sweden',
    avatarSeed: 'Yuki',
    jobId: 'senior-frontend-engineer',
    stage: 'case',
    source: 'LinkedIn',
    appliedAt: '2026-08-16',
    starred: false,
    unread: false,
    tags: ['Accessibility', 'Screen readers', 'Strong'],
    links: { github: 'github.example/ytanaka', portfolio: 'yuki.example' },
    salaryExpectation: '70 000 SEK / month',
    noticePeriod: '2 months',
    workPermit: 'Permanent residence, Sweden',
    summary:
      'Frontend engineer and accessibility specialist. Six years, the last three ' +
      'consulting on WCAG remediation for large public and financial systems. I ' +
      'test with a screen reader daily, not before releases.',
    experience: [
      {
        role: 'Accessibility Engineer',
        company: 'Tillgänglig AB',
        period: '2023 — present',
        location: 'Stockholm',
        bullets: [
          'Led WCAG 2.2 AA remediation for three Swedish banks and one government portal.',
          'Built an automated audit pipeline catching roughly 60% of regressions before review.',
          'Trained 120+ engineers across client organisations on assistive-technology testing.'
        ]
      },
      {
        role: 'Frontend Engineer',
        company: 'Bonnier News',
        period: '2020 — 2023',
        location: 'Stockholm',
        bullets: [
          'Product work on the subscription and reading experience.',
          'Introduced the accessibility practice that later became my whole career.'
        ]
      }
    ],
    education: [{ degree: 'BSc Media Technology', school: 'Linköping University', period: '2016 — 2020' }],
    skills: ['TypeScript', 'React', 'Svelte', 'ARIA', 'Screen reader testing', 'axe / Pa11y', 'Design systems'],
    languages: [
      { name: 'Japanese', level: 'Native' },
      { name: 'Swedish', level: 'Fluent' },
      { name: 'English', level: 'Fluent' }
    ],
    coverLetter:
      'Your posting is the first senior frontend ad I have seen this year that ' +
      'lists accessibility as a responsibility rather than a checkbox at the ' +
      'bottom. In a control room it is not a compliance question, it is a ' +
      'question of whether a tired operator at 3am can parse the screen. I would ' +
      'like to work on that.',
    scorecards: [
      {
        id: 'sc-yuki-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-21',
        criteria: { craft: 4, problem: 4, communication: 5, ownership: 4, collaboration: 5 },
        comment: 'Deep specialist knowledge, explains it without condescension. Slight question on breadth — has she shipped product recently?'
      },
      {
        id: 'sc-yuki-2', author: 'Talal', stage: 'interview', date: '2026-09-03',
        criteria: { craft: 4, problem: 4, communication: 5, ownership: 4, collaboration: 5 },
        comment: 'Breadth question mostly answered — the Bonnier work was real product delivery. Case will settle it.'
      }
    ],
    notes: [
      { id: 'n-yuki-1', author: 'Talal', at: '2026-09-03T17:10:00Z', body: 'Running the same alarm-panel case as Amira so we can compare directly. Due the 18th.' }
    ]
  },
  {
    id: 'fatima-el-amrani',
    firstName: 'Fatima',
    lastName: 'El Amrani',
    pronouns: 'she/her',
    headline: 'Talent acquisition — agency to in-house, technical hiring',
    email: 'fatima.elamrani@example.com',
    phone: '+46 70 555 2287',
    location: 'Stockholm, Sweden',
    avatarSeed: 'Fatima',
    jobId: 'talent-partner',
    stage: 'screening',
    source: 'Careers site',
    appliedAt: '2026-09-03',
    starred: false,
    unread: false,
    tags: ['Agency background', 'Sourcing'],
    links: { linkedin: 'in.example/fatimaelamrani' },
    salaryExpectation: '52 000 SEK / month',
    noticePeriod: '1 month',
    workPermit: 'Swedish citizen',
    summary:
      'Four years in technical recruitment — three agency-side, one in-house. ' +
      'Very strong sourcer. Looking to go fully in-house so I can own the ' +
      'process rather than feed someone else\'s.',
    experience: [
      {
        role: 'Technical Recruiter',
        company: 'Nordkraft Energi',
        period: '2025 — present',
        location: 'Stockholm',
        bullets: [
          'First in-house recruiter; hired 14 engineers in my first year.',
          'Built the careers page and interview kits from nothing.'
        ]
      },
      {
        role: 'Senior Consultant',
        company: 'Academic Work',
        period: '2022 — 2025',
        location: 'Stockholm',
        bullets: [
          'Technical recruitment across 40+ client companies.',
          'Top biller in the Stockholm tech desk two years running.'
        ]
      }
    ],
    education: [{ degree: 'BSc Sociology', school: 'Lund University', period: '2018 — 2021' }],
    skills: ['Sourcing', 'Boolean search', 'Candidate experience', 'Interview kits', 'Teamtailor', 'LinkedIn Recruiter'],
    languages: [
      { name: 'Swedish', level: 'Native' },
      { name: 'Arabic', level: 'Fluent' },
      { name: 'English', level: 'Fluent' },
      { name: 'French', level: 'Conversational' }
    ],
    coverLetter:
      'I have done the agency years and I am glad I did — nobody sources like ' +
      'someone who had a weekly target. But I want to own a funnel end to end ' +
      'and be measured on whether people stay, not on whether they start. Helio ' +
      'is at exactly the size where that is still possible to build properly.',
    scorecards: [
      {
        id: 'sc-fatima-1', author: 'Talal', stage: 'screening', date: '2026-09-10',
        criteria: { craft: 4, problem: 3, communication: 5, ownership: 4, collaboration: 4 },
        comment: 'Excellent sourcer, great energy. Less experienced on process design than Elsa looks on paper — want to see both before deciding.'
      }
    ],
    notes: []
  },
  {
    id: 'pavel-novak',
    firstName: 'Pavel',
    lastName: 'Novák',
    pronouns: 'he/him',
    headline: 'Analytics engineer — dbt, semantic layers',
    email: 'pavel.novak@example.com',
    phone: '+420 6 555 31 22',
    location: 'Brno, Czechia',
    avatarSeed: 'Pavel',
    jobId: 'data-engineer',
    stage: 'rejected',
    rejectionReason: 'Experience not a match',
    source: 'Job board',
    appliedAt: '2026-08-19',
    starred: false,
    unread: false,
    tags: ['Analytics engineering'],
    links: { linkedin: 'in.example/pavelnovak' },
    salaryExpectation: '50 000 SEK / month',
    noticePeriod: '2 months',
    workPermit: 'EU citizen',
    summary:
      'Analytics engineer with three years on dbt and semantic modelling. Strong ' +
      'on transformation and metric definition, lighter on ingestion and ' +
      'infrastructure.',
    experience: [
      {
        role: 'Analytics Engineer',
        company: 'Mall Group',
        period: '2023 — present',
        location: 'Brno',
        bullets: [
          'Own 120 dbt models and the metric layer behind the commercial reporting suite.',
          'Introduced testing and documentation standards across the analytics repo.'
        ]
      },
      {
        role: 'Data Analyst',
        company: 'Kiwi.com',
        period: '2021 — 2023',
        location: 'Brno',
        bullets: ['Pricing and availability analysis for the flights marketplace.']
      }
    ],
    education: [{ degree: 'MSc Applied Mathematics', school: 'Masaryk University', period: '2016 — 2021' }],
    skills: ['dbt', 'SQL', 'Looker', 'Python (analysis)', 'BigQuery', 'Metric modelling'],
    languages: [
      { name: 'Czech', level: 'Native' },
      { name: 'English', level: 'Fluent' }
    ],
    coverLetter:
      'I am an analytics engineer applying to a data engineering role, so let me ' +
      'address that directly: I have not owned ingestion or orchestration in ' +
      'production. What I have is unusually deep modelling and testing practice. ' +
      'If the role has room for someone to grow into the platform side I would ' +
      'be a strong bet.',
    scorecards: [
      {
        id: 'sc-pavel-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-27',
        criteria: { craft: 3, problem: 3, communication: 4, ownership: 3, collaboration: 4 },
        comment: 'Likeable and self-aware, but the gap he names in his cover letter is the actual core of this role. Not this req.'
      }
    ],
    notes: [
      { id: 'n-pavel-1', author: 'Saga Wikström', at: '2026-08-28T10:20:00Z', body: 'Rejected with a real note — he was honest with us, worth being honest back. Added to the talent pool for any future analytics engineering opening.' }
    ]
  },
  {
    id: 'clara-bergman',
    firstName: 'Clara',
    lastName: 'Bergman',
    pronouns: 'she/her',
    headline: 'Customer success — utilities, technical account management',
    email: 'clara.bergman@example.com',
    phone: '+49 160 555 4438',
    location: 'Hamburg, Germany',
    avatarSeed: 'Clara',
    jobId: 'customer-success-manager',
    stage: 'hired',
    source: 'Referral',
    referredBy: 'Katrin Vogel (Revenue)',
    appliedAt: '2026-07-28',
    startDate: '2026-11-01',
    starred: true,
    unread: false,
    tags: ['Utilities', 'Signed'],
    links: { linkedin: 'in.example/clarabergman' },
    salaryExpectation: '€74 000 OTE',
    noticePeriod: '2 months',
    workPermit: 'German citizen',
    summary:
      'Technical account manager turned CSM, six years, all of it in energy and ' +
      'utilities. I can read a load profile and I can chair a steering committee ' +
      'with a Stadtwerk board, which turns out to be a rare combination.',
    experience: [
      {
        role: 'Technical Account Manager',
        company: 'Enertrag Digital',
        period: '2022 — present',
        location: 'Hamburg',
        bullets: [
          'Own eight utility accounts from technical onboarding through renewal — €4.2M ARR.',
          'Led the integration programme connecting customer SCADA systems to our platform.',
          'Zero churn across the book in three years.'
        ]
      },
      {
        role: 'Implementation Consultant',
        company: 'Vattenfall Services',
        period: '2020 — 2022',
        location: 'Hamburg',
        bullets: ['Rolled out metering and settlement software across twelve regional utilities.']
      }
    ],
    education: [{ degree: 'Dipl.-Ing. Energy Systems', school: 'TU Hamburg', period: '2015 — 2020' }],
    skills: ['Technical account management', 'SCADA integration', 'SQL', 'Renewals', 'Stakeholder management', 'Energy markets'],
    languages: [
      { name: 'German', level: 'Native' },
      { name: 'English', level: 'Fluent' },
      { name: 'Swedish', level: 'Basic' }
    ],
    coverLetter:
      'Katrin and I worked opposite each other on the Stadtwerke Lübeck rollout ' +
      'and she has been telling me to join Helio for a year. I have spent six ' +
      'years watching utilities try to modernise with software that was not ' +
      'built for them. Yours appears to have been.',
    scorecards: [
      {
        id: 'sc-clara-1', author: 'Saga Wikström', stage: 'screening', date: '2026-08-03',
        criteria: { craft: 5, problem: 4, communication: 5, ownership: 5, collaboration: 5 },
        comment: 'Exactly the profile the req was written for. Almost suspiciously good fit.'
      },
      {
        id: 'sc-clara-2', author: 'Katrin Vogel', stage: 'interview', date: '2026-08-12',
        criteria: { craft: 5, problem: 5, communication: 5, ownership: 5, collaboration: 5 },
        comment: 'I have worked with her. Strong yes, no reservations.'
      },
      {
        id: 'sc-clara-3', author: 'Talal', stage: 'case', date: '2026-08-21',
        criteria: { craft: 5, problem: 4, communication: 5, ownership: 5, collaboration: 4 },
        comment: 'Account plan she presented was better than some of our internal ones. Making the offer.'
      }
    ],
    notes: [
      { id: 'n-clara-1', author: 'Talal', at: '2026-08-26T11:00:00Z', body: 'Offer accepted. Start 1 November. Katrin owns onboarding.' }
    ]
  }
];
