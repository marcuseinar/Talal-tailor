/**
 * Open requisitions for the demo company.
 *
 * Shape mirrors what a real ATS stores per job: everything the public careers
 * page needs plus the internal fields (owner, openings, budget) the hiring
 * team works from.
 */

/** @typedef {'Engineering'|'Design'|'People'|'Revenue'} Department */

export const COMPANY = {
  name: 'Helio',
  tagline: 'Grid software for the electrified century',
  about:
    'Helio builds the forecasting and dispatch software that keeps renewable ' +
    'energy flowing when the wind drops and the sun sets. We are 84 people ' +
    'across Stockholm, Berlin and remote, and we are hiring the team that ' +
    'will take our platform to its next ten markets.',
  website: 'helio.example',
  locations: ['Stockholm', 'Berlin', 'Remote — EU']
};

export const JOBS = [
  {
    id: 'senior-frontend-engineer',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    location: 'Stockholm',
    workplace: 'Hybrid — 2 days on site',
    employment: 'Full-time · Permanent',
    seniority: 'Senior',
    salary: '62 000 – 78 000 SEK / month',
    openings: 2,
    owner: 'Talal',
    recruiter: 'Saga Wikström',
    publishedAt: '2026-08-04',
    closesAt: '2026-10-15',
    summary:
      'Own the interfaces grid operators stare at for eight hours a day. Heavy ' +
      'on data density, real-time state and accessibility.',
    about:
      'Our control-room product renders tens of thousands of live data points ' +
      'per screen and operators make six-figure decisions from it. You will ' +
      'work with two other frontend engineers, a designer and the forecasting ' +
      'team to make that surface fast, legible and impossible to misread.',
    responsibilities: [
      'Lead frontend architecture for the control-room product',
      'Build real-time views over WebSocket streams without dropping frames',
      'Grow our component library and its accessibility guarantees',
      'Mentor two mid-level engineers through code review and pairing'
    ],
    requirements: [
      '5+ years building production web applications',
      'Deep JavaScript and TypeScript, plus a modern component framework',
      'Comfortable with performance profiling and rendering budgets',
      'You have shipped something that had to work at 3am'
    ],
    niceToHave: [
      'Svelte or SolidJS in production',
      'Data visualisation beyond a charting library',
      'Energy, logistics or trading domain experience'
    ],
    perks: [
      '30 days holiday',
      'Occupational pension (ITP1)',
      'SEK 12 000 yearly learning budget',
      'Four-week paid sabbatical every fourth year'
    ],
    tags: ['TypeScript', 'Svelte', 'Realtime', 'Design systems'],
    pipelineSla: { screening: 3, interview: 7 }
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote — EU',
    workplace: 'Remote — EU timezones',
    employment: 'Full-time · Permanent',
    seniority: 'Mid–Senior',
    salary: '€58 000 – €72 000 / year',
    openings: 1,
    owner: 'Talal',
    recruiter: 'Saga Wikström',
    publishedAt: '2026-08-18',
    closesAt: '2026-10-01',
    summary:
      'Design for operators, not for dribbble. You will spend real time in ' +
      'control rooms before you open a design tool.',
    about:
      'You are the second designer at Helio and the first to sit fully inside ' +
      'the platform team. The work is systems design: state machines, error ' +
      'surfaces, dense tables, and the alarm patterns that decide whether an ' +
      'operator notices a fault in four seconds or forty.',
    responsibilities: [
      'Own end-to-end design for the dispatch and alarms experience',
      'Run field research with operators in Sweden and Germany',
      'Extend the Helio design system with accessible, dense components',
      'Pair with engineers daily — we prototype in code, not in prose'
    ],
    requirements: [
      '4+ years designing complex, data-heavy software',
      'A portfolio that shows reasoning, not just final screens',
      'Fluency with design systems and component thinking',
      'You can defend a decision and change your mind in the same meeting'
    ],
    niceToHave: [
      'You can build your own prototypes in HTML/CSS',
      'Experience with safety-critical or industrial interfaces',
      'Motion and interaction design chops'
    ],
    perks: [
      'Fully remote within EU timezones',
      '€1 500 yearly learning budget',
      'Home office setup budget',
      'Quarterly team weeks in Stockholm'
    ],
    tags: ['Systems design', 'Research', 'Accessibility', 'Figma'],
    pipelineSla: { screening: 4, interview: 7 }
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    department: 'Engineering',
    location: 'Stockholm',
    workplace: 'Hybrid — 2 days on site',
    employment: 'Full-time · Permanent',
    seniority: 'Mid–Senior',
    salary: '58 000 – 72 000 SEK / month',
    openings: 1,
    owner: 'Talal',
    recruiter: 'Saga Wikström',
    publishedAt: '2026-07-22',
    closesAt: '2026-09-30',
    summary:
      'Keep the pipelines that feed our forecasting models honest, on time and ' +
      'cheap enough to run every fifteen minutes.',
    about:
      'Weather feeds, SCADA telemetry, day-ahead prices and imbalance ' +
      'settlements all land in our lakehouse. You will own the ingestion and ' +
      'transformation layer under that, and the data contracts that keep the ' +
      'ML team from waking up to silent schema drift.',
    responsibilities: [
      'Own ingestion from 30+ external feeds with wildly different reliability',
      'Build and monitor dbt models powering the forecasting features',
      'Introduce data contracts and quality gates in CI',
      'Cut our warehouse spend without cutting freshness'
    ],
    requirements: [
      '3+ years in data engineering with production ownership',
      'Strong SQL and Python',
      'Orchestration experience (Airflow, Dagster or similar)',
      'You treat pipeline failures as product bugs'
    ],
    niceToHave: [
      'Streaming experience (Kafka, Flink)',
      'Time-series at scale',
      'Energy market data'
    ],
    perks: [
      '30 days holiday',
      'Occupational pension (ITP1)',
      'SEK 12 000 yearly learning budget',
      'Conference travel, one per year, your pick'
    ],
    tags: ['Python', 'dbt', 'Airflow', 'Time-series'],
    pipelineSla: { screening: 3, interview: 7 }
  },
  {
    id: 'talent-partner',
    title: 'Talent Partner',
    department: 'People',
    location: 'Stockholm',
    workplace: 'On site',
    employment: 'Full-time · Permanent',
    seniority: 'Mid',
    salary: '48 000 – 58 000 SEK / month',
    openings: 1,
    owner: 'Talal',
    recruiter: 'Talal',
    publishedAt: '2026-08-26',
    closesAt: '2026-10-20',
    summary:
      'Own hiring end to end for engineering. You will be the reason good ' +
      'people say yes, and the reason the rest get a straight answer quickly.',
    about:
      'We are going from 84 to roughly 130 people over the next 18 months. ' +
      'This role owns the engineering side of that: sourcing, process design, ' +
      'candidate experience and the uncomfortable conversations with hiring ' +
      'managers about what "senior" actually means.',
    responsibilities: [
      'Run full-cycle recruitment for 6–8 concurrent engineering roles',
      'Build structured interview kits with hiring managers',
      'Own candidate experience metrics and time-to-decision',
      'Coach managers out of gut-feel hiring'
    ],
    requirements: [
      '3+ years in-house tech recruitment',
      'You have designed a hiring process, not just worked inside one',
      'Comfortable pushing back on senior stakeholders',
      'Swedish and English, professional level'
    ],
    niceToHave: [
      'Employer branding experience',
      'You have run hiring in a scale-up past 100 people',
      'Data-driven approach to funnel analysis'
    ],
    perks: [
      '30 days holiday',
      'Occupational pension (ITP1)',
      'Wellness allowance SEK 5 000',
      'Hybrid after probation'
    ],
    tags: ['Full-cycle', 'Structured hiring', 'Employer brand'],
    pipelineSla: { screening: 2, interview: 5 }
  },
  {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    department: 'Revenue',
    location: 'Berlin',
    workplace: 'Hybrid — 3 days on site',
    employment: 'Full-time · Permanent',
    seniority: 'Mid',
    salary: '€62 000 – €74 000 OTE',
    openings: 2,
    owner: 'Talal',
    recruiter: 'Saga Wikström',
    publishedAt: '2026-08-11',
    closesAt: '2026-10-10',
    summary:
      'Own a book of German and Austrian utilities from onboarding through ' +
      'renewal. Technical enough to be trusted by an operations lead.',
    about:
      'Our German customers are regional utilities with 40-year-old processes ' +
      'and brand-new regulatory pressure. Success here is not QBRs — it is ' +
      'getting an operations team to actually change how they dispatch, and ' +
      'proving the saving afterwards.',
    responsibilities: [
      'Own onboarding and adoption for 12–18 utility accounts',
      'Translate operational goals into measurable platform usage',
      'Run quarterly value reviews with data, not slides',
      'Feed the product roadmap with what the market actually needs'
    ],
    requirements: [
      '3+ years in customer success or account management for B2B software',
      'German (native or C2) and English, professional level',
      'Comfortable reading a dashboard and arguing with it',
      'Willing to travel roughly one week per month'
    ],
    niceToHave: [
      'Energy or utilities background',
      'SQL literacy',
      'Experience with enterprise renewal negotiation'
    ],
    perks: [
      '30 days holiday',
      'Deutschlandticket covered',
      'Learning budget €1 500 / year',
      'Quarterly team weeks in Stockholm'
    ],
    tags: ['B2B SaaS', 'Utilities', 'German', 'Renewals'],
    pipelineSla: { screening: 3, interview: 6 }
  }
];

/** @type {Record<string, typeof JOBS[number]>} */
export const JOBS_BY_ID = Object.fromEntries(JOBS.map((j) => [j.id, j]));

export const DEPARTMENTS = [...new Set(JOBS.map((j) => j.department))];
