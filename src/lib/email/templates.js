/**
 * Candidate email templates with merge fields.
 *
 * Nothing is actually sent — the demo has no mail transport — but the render
 * step, the merge-field resolution and the activity-log entry are all real, so
 * wiring this to an ESP later is a single function.
 */

export const MERGE_FIELDS = [
  { token: 'first_name', label: 'First name' },
  { token: 'last_name', label: 'Last name' },
  { token: 'job_title', label: 'Job title' },
  { token: 'company', label: 'Company' },
  { token: 'stage', label: 'Current stage' },
  { token: 'recruiter', label: 'Recruiter' }
];

export const TEMPLATES = [
  {
    id: 'acknowledge',
    name: 'Application received',
    stage: 'inbox',
    subject: 'We have your application — {{job_title}} at {{company}}',
    body: `Hi {{first_name}},

Thanks for applying for {{job_title}}. Your application is with the hiring team and we will come back to you within five working days, either way.

If anything changes in the meantime — another offer, a change of heart — just reply to this email and tell us.

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'invite-screen',
    name: 'Invite to intro call',
    stage: 'screening',
    subject: 'Intro call for {{job_title}}?',
    body: `Hi {{first_name}},

We have read your application for {{job_title}} and would like to talk. The first conversation is 30 minutes, no preparation needed — we will walk through your background and you can ask us anything about the role.

Could you send a couple of times that suit you this week or next?

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'invite-interview',
    name: 'Invite to team interview',
    stage: 'interview',
    subject: 'Next step: meeting the team',
    body: `Hi {{first_name}},

Good news — we would like to take your {{job_title}} application to the next stage. This is 60 minutes with two people from the team, focused on how you work rather than trivia.

We will send a short brief beforehand so you know exactly what to expect.

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'send-case',
    name: 'Send case study',
    stage: 'case',
    subject: 'Case study for {{job_title}}',
    body: `Hi {{first_name}},

Here is the case study we mentioned. It is designed to take about two hours — please do not spend more than that, and tell us if that is not realistic this week.

We will spend the first half of the follow-up session walking through your thinking, not grading the output.

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'offer',
    name: 'Offer',
    stage: 'offer',
    subject: 'An offer from {{company}}',
    body: `Hi {{first_name}},

We would like to offer you the {{job_title}} role. The full terms are attached; the headline is below, and we are happy to talk through any of it.

Take the time you need to decide, and please do ask the awkward questions now rather than later.

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'reject-early',
    name: 'Rejection — after review',
    stage: 'rejected',
    subject: 'Your application for {{job_title}}',
    body: `Hi {{first_name}},

Thank you for applying for {{job_title}}. We have decided not to take your application further this time.

To be specific rather than vague: the shortlist came down to depth in the core area of the role, and other candidates were further along there. That is a comment on a single job spec, not on your work.

We keep applications on file for 12 months — tell us if you would rather we did not.

Best,
{{recruiter}}
{{company}}`
  },
  {
    id: 'reject-late',
    name: 'Rejection — after interview',
    stage: 'rejected',
    subject: 'Your application for {{job_title}}',
    body: `Hi {{first_name}},

Thank you for the time you put into our process — the interviews and the case study are a real investment and we do not take that lightly.

We have decided to move forward with another candidate for {{job_title}}. The decision was close and it came down to specific overlap with what the team needs in the first six months.

I am happy to give you detailed feedback on a call if that would be useful. Just say the word.

Best,
{{recruiter}}
{{company}}`
  }
];

/** Replace {{tokens}} with candidate values; unknown tokens are left visible. */
export function renderTemplate(text, context) {
  return String(text ?? '').replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, token) => {
    const value = context[token];
    return value === undefined || value === null || value === '' ? match : String(value);
  });
}

export function templateContext(candidate, { jobTitle, company, recruiter, stageLabel }) {
  return {
    first_name: candidate.firstName,
    last_name: candidate.lastName,
    job_title: jobTitle,
    company,
    stage: stageLabel,
    recruiter
  };
}

/** Templates that make sense at the candidate's current stage, best first. */
export function templatesForStage(stage) {
  return [...TEMPLATES].sort((a, b) => (a.stage === stage ? -1 : b.stage === stage ? 1 : 0));
}
