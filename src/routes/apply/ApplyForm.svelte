<script>
  /**
   * The job description and its application form.
   *
   * The form is the real thing: validation, a PDF CV upload and a photo upload
   * that gets downscaled client-side. Submitting writes a candidate record that
   * appears immediately in the hiring inbox.
   */
  import { ats } from '../../lib/store/ats.svelte.js';
  import { navigate } from '../../lib/router.svelte.js';
  import { MAX_UPLOAD_BYTES, ACCEPTED_CV_TYPES, ACCEPTED_PHOTO_TYPES } from '../../lib/store/schema.js';
  import PublicHeader from '../../components/PublicHeader.svelte';
  import FileDrop from '../../components/FileDrop.svelte';
  import Icon from '../../components/Icon.svelte';
  import NotFound from '../NotFound.svelte';

  let { params } = $props();
  const job = $derived(ats.job(params.jobId));

  let form = $state({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    coverLetter: '',
    salaryExpectation: '',
    noticePeriod: '',
    skills: '',
    portfolio: '',
    linkedin: '',
    consent: false
  });

  let cv = $state(null);
  let photo = $state(null);
  let errors = $state({});
  let submitting = $state(false);
  let attempted = $state(false);

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'Tell us your first name.';
    if (!form.lastName.trim()) next.lastName = 'Tell us your last name.';
    if (!form.email.trim()) next.email = 'We need an email address to reply to.';
    else if (!EMAIL.test(form.email.trim())) next.email = 'That does not look like an email address.';
    if (!cv) next.cv = 'Attach your CV as a PDF.';
    if (!form.consent) next.consent = 'We need your permission to store the application.';
    errors = next;
    return Object.keys(next).length === 0;
  }

  // Re-check as the applicant types, but only after a failed submit — no
  // scolding someone for a field they have not reached yet.
  $effect(() => {
    if (!attempted) return;
    void [form.firstName, form.lastName, form.email, form.consent, cv];
    validate();
  });

  async function submit(event) {
    event.preventDefault();
    attempted = true;
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    submitting = true;
    try {
      const candidate = await ats.submitApplication({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        location: form.location,
        headline: form.headline || job.title,
        coverLetter: form.coverLetter,
        summary: form.coverLetter.split('\n')[0] ?? '',
        salaryExpectation: form.salaryExpectation,
        noticePeriod: form.noticePeriod,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        links: { portfolio: form.portfolio.trim(), linkedin: form.linkedin.trim() },
        jobId: job.id,
        cv,
        photo: photo?.dataUrl ?? null
      });
      navigate(`/applied/${candidate.id}`);
    } finally {
      submitting = false;
    }
  }
</script>

{#if !job}
  <NotFound />
{:else}
  <PublicHeader showBack />

  <main id="main" class="page">
    <article class="spec">
      <p class="eyebrow">{job.department} · {job.location}</p>
      <h1>{job.title}</h1>
      <p class="summary">{job.summary}</p>

      <dl class="quick">
        <div><dt>Contract</dt><dd>{job.employment}</dd></div>
        <div><dt>Workplace</dt><dd>{job.workplace}</dd></div>
        <div><dt>Salary</dt><dd>{job.salary}</dd></div>
        <div><dt>Openings</dt><dd class="numeric">{job.openings}</dd></div>
      </dl>

      <section>
        <h2>About the role</h2>
        <p>{job.about}</p>
      </section>

      <section>
        <h2>What you will do</h2>
        <ul>{#each job.responsibilities as item (item)}<li>{item}</li>{/each}</ul>
      </section>

      <section>
        <h2>What we are looking for</h2>
        <ul>{#each job.requirements as item (item)}<li>{item}</li>{/each}</ul>
      </section>

      <section>
        <h2>Nice to have</h2>
        <ul>{#each job.niceToHave as item (item)}<li>{item}</li>{/each}</ul>
      </section>

      <section>
        <h2>What we offer</h2>
        <ul>{#each job.perks as item (item)}<li>{item}</li>{/each}</ul>
      </section>
    </article>

    <div class="form-col">
      <form class="card form" onsubmit={submit} novalidate>
        <div class="form-head">
          <h2>Apply for this role</h2>
          <p>Five minutes. We read every application.</p>
        </div>

        {#if attempted && Object.keys(errors).length}
          <p class="summary-error" role="alert">
            <Icon name="x" size={14} />
            {Object.keys(errors).length} thing{Object.keys(errors).length === 1 ? '' : 's'} still
            needs your attention.
          </p>
        {/if}

        <div class="grid-2">
          <div class="field">
            <label for="firstName">First name</label>
            <input
              id="firstName"
              class="input"
              bind:value={form.firstName}
              aria-invalid={errors.firstName ? 'true' : undefined}
              autocomplete="given-name"
            />
            {#if errors.firstName}<p class="field-error">{errors.firstName}</p>{/if}
          </div>
          <div class="field">
            <label for="lastName">Last name</label>
            <input
              id="lastName"
              class="input"
              bind:value={form.lastName}
              aria-invalid={errors.lastName ? 'true' : undefined}
              autocomplete="family-name"
            />
            {#if errors.lastName}<p class="field-error">{errors.lastName}</p>{/if}
          </div>
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            class="input"
            type="email"
            bind:value={form.email}
            aria-invalid={errors.email ? 'true' : undefined}
            autocomplete="email"
            placeholder="you@example.com"
          />
          {#if errors.email}<p class="field-error">{errors.email}</p>{/if}
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="phone">Phone <span class="opt">optional</span></label>
            <input id="phone" class="input" type="tel" bind:value={form.phone} autocomplete="tel" />
          </div>
          <div class="field">
            <label for="location">Location <span class="opt">optional</span></label>
            <input id="location" class="input" bind:value={form.location} placeholder="Stockholm, Sweden" />
          </div>
        </div>

        <div class="field">
          <label for="headline">One-line summary <span class="opt">optional</span></label>
          <input
            id="headline"
            class="input"
            bind:value={form.headline}
            placeholder="Frontend engineer — realtime interfaces"
          />
        </div>

        <FileDrop
          id="cv"
          label="CV (PDF)"
          required
          accept={ACCEPTED_CV_TYPES}
          maxBytes={MAX_UPLOAD_BYTES}
          value={cv}
          hint="Your file stays on this device — nothing is uploaded to a server."
          onchange={(file) => (cv = file)}
        />
        {#if errors.cv}<p class="field-error">{errors.cv}</p>{/if}

        <FileDrop
          id="photo"
          label="Photo"
          kind="image"
          accept={ACCEPTED_PHOTO_TYPES}
          maxBytes={MAX_UPLOAD_BYTES}
          value={photo}
          hint="Helps the team put a face to the name. Entirely optional."
          onchange={(file) => (photo = file)}
        />

        <div class="field">
          <label for="coverLetter">Why this role? <span class="opt">optional</span></label>
          <textarea
            id="coverLetter"
            class="textarea"
            rows="5"
            bind:value={form.coverLetter}
            placeholder="A few honest sentences beat a page of adjectives."
          ></textarea>
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="salary">Salary expectation <span class="opt">optional</span></label>
            <input id="salary" class="input" bind:value={form.salaryExpectation} placeholder={job.salary} />
          </div>
          <div class="field">
            <label for="notice">Notice period <span class="opt">optional</span></label>
            <input id="notice" class="input" bind:value={form.noticePeriod} placeholder="2 months" />
          </div>
        </div>

        <div class="field">
          <label for="skills">Key skills <span class="opt">comma separated</span></label>
          <input id="skills" class="input" bind:value={form.skills} placeholder={job.tags.join(', ')} />
        </div>

        <div class="grid-2">
          <div class="field">
            <label for="portfolio">Portfolio or website <span class="opt">optional</span></label>
            <input id="portfolio" class="input" bind:value={form.portfolio} placeholder="yoursite.example" />
          </div>
          <div class="field">
            <label for="linkedin">LinkedIn <span class="opt">optional</span></label>
            <input id="linkedin" class="input" bind:value={form.linkedin} placeholder="in.example/you" />
          </div>
        </div>

        <label class="consent" for="consent">
          <input id="consent" type="checkbox" bind:checked={form.consent} aria-invalid={errors.consent ? 'true' : undefined} />
          <span>
            Store my application for 12 months so the team can consider me for this and similar
            roles. I can ask for it to be deleted at any time.
          </span>
        </label>
        {#if errors.consent}<p class="field-error">{errors.consent}</p>{/if}

        <button class="btn btn--accent btn--lg submit" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send application'}
          {#if !submitting}<Icon name="arrowRight" size={16} />{/if}
        </button>
      </form>
    </div>
  </main>
{/if}

<style>
  .page {
    max-inline-size: 1180px;
    margin-inline: auto;
    padding-inline: clamp(16px, 4vw, 40px);
    padding-block: clamp(26px, 5vw, 48px) 72px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
    gap: clamp(26px, 4vw, 52px);
    align-items: start;
  }

  .spec {
    min-inline-size: 0;
  }
  h1 {
    margin-block-start: 10px;
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(30px, 4.6vw, 44px);
    line-height: 1.06;
  }
  .summary {
    margin-block-start: 12px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--ink-2);
    max-inline-size: 58ch;
  }
  .quick {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 14px;
    margin: 24px 0 0;
    padding: 16px 18px;
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: var(--radius);
  }
  .quick dt {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-4);
  }
  .quick dd {
    margin: 4px 0 0;
    font-size: 13.5px;
    font-weight: 500;
  }

  .spec section {
    margin-block-start: 28px;
  }
  .spec h2 {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-block-end: 10px;
  }
  .spec p {
    font-size: 14px;
    line-height: 1.65;
    color: var(--ink-2);
    max-inline-size: 62ch;
  }
  .spec ul {
    margin: 0;
    padding-inline-start: 18px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    max-inline-size: 62ch;
  }
  .spec li {
    font-size: 14px;
    line-height: 1.55;
    color: var(--ink-2);
  }
  .spec li::marker {
    color: var(--accent);
  }

  .form-col {
    position: sticky;
    top: calc(64px + env(safe-area-inset-top, 0px));
  }
  .form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 22px;
    box-shadow: var(--shadow);
  }
  .form-head h2 {
    font-size: 18px;
  }
  .form-head p {
    margin-block-start: 4px;
    font-size: 13px;
    color: var(--ink-3);
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .opt {
    font-weight: 400;
    font-size: 11px;
    color: var(--ink-4);
    margin-inline-start: 5px;
  }
  .summary-error {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 12px;
    border-radius: var(--radius-sm);
    background: var(--bad-wash);
    color: var(--bad);
    font-size: 12.5px;
    font-weight: 500;
  }
  .consent {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 12.5px;
    line-height: 1.5;
    color: var(--ink-2);
    cursor: pointer;
  }
  .consent input {
    margin-block-start: 2px;
    inline-size: 15px;
    block-size: 15px;
    accent-color: var(--brand);
    flex: none;
  }
  .submit {
    margin-block-start: 4px;
  }

  @media (max-width: 940px) {
    .page {
      grid-template-columns: minmax(0, 1fr);
    }
    .form-col {
      position: static;
    }
  }
  @media (max-width: 460px) {
    .grid-2 {
      grid-template-columns: 1fr;
    }
  }
</style>
