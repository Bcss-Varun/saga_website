'use client';

import { useEffect, useRef, useState } from 'react';
import { contact as C } from '../lib/content/contact';
import { provenance, sourcePage, verticalFromRoute, FORM_VERSION } from '../lib/visitSource';
import styles from './contact.module.css';

/* Static export, so there is no server route. The destination is read from
   NEXT_PUBLIC_CONTACT_ENDPOINT at build time; with none set the form validates
   and then says plainly that it has nowhere to send — it does not fake a
   success. [pending: endpoint] */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '';

/* Spam protection without a dependency or a third-party script.

   Two signals, treated very differently, because the cost of a false positive
   here is losing a government demo request — the one thing this project is
   measured on:

   1. Honeypot — a field hidden off-screen, aria-hidden and out of the tab
      order. A person cannot reach it, so a value in it is conclusive. Dropped
      silently, showing the normal confirmation so a bot learns nothing.

   2. Time on form — suggestive, not conclusive. A procurement officer pasting
      prepared answers, or a browser autofilling the lot, can legitimately be
      fast. So a fast submission is NOT dropped: it is sent with
      `suspected_automation: true` and the elapsed time attached, and whoever
      receives it decides. Silently discarding a real enquiry to block a bot is
      the wrong trade for this form. */
const FAST_SECONDS = 4;

const REQUIRED = ['name', 'organisation', 'role', 'vertical', 'region', 'message'];

export default function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    organisation: '',
    role: '',
    vertical: '',
    region: '',
    message: '',
    consent: false,
    company_website: '', // honeypot
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | sent | error | unconfigured
  const openedAt = useRef(Date.now());
  const statusRef = useRef(null);

  /* Pre-select the vertical from the page the visitor came from. Done in an
     effect because the source lives in sessionStorage, which the server render
     cannot see — the field renders empty and fills in on the client. */
  useEffect(() => {
    const v = verticalFromRoute(sourcePage());
    if (v) setValues((prev) => (prev.vertical ? prev : { ...prev, vertical: v }));
  }, []);

  /* Move focus to the outcome so a screen reader is told what happened. */
  useEffect(() => {
    if (state === 'sent' || state === 'error' || state === 'unconfigured') {
      statusRef.current?.focus();
    }
  }, [state]);

  const validate = (vals) => {
    const next = {};
    for (const k of REQUIRED) {
      if (!String(vals[k] || '').trim()) next[k] = C.fields[k].error;
    }
    if (!vals.consent) next.consent = C.fields.consent.error;
    return next;
  };

  const set = (k, v) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched(Object.fromEntries([...REQUIRED, 'consent'].map((k) => [k, true])));
    if (Object.keys(found).length) {
      document.querySelector(`[data-field="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }
    // Honeypot: conclusive. Dropped silently behind the normal confirmation.
    if (values.company_website) {
      setState('sent');
      return;
    }

    const elapsedMs = Date.now() - openedAt.current;
    const payload = {
      name: values.name.trim(),
      organisation: values.organisation.trim(),
      role: values.role.trim(),
      vertical: values.vertical,
      region: values.region.trim(),
      message: values.message.trim(),
      consent: true,
      consent_text: C.fields.consent.label,
      consent_at: new Date().toISOString(),
      ...provenance(),
      submitted_at: new Date().toISOString(),
      form_version: FORM_VERSION,
      elapsed_ms: elapsedMs,
      suspected_automation: elapsedMs / 1000 < FAST_SECONDS,
    };

    if (!ENDPOINT) {
      setState('unconfigured');
      return;
    }

    setState('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  if (state === 'sent' || state === 'error' || state === 'unconfigured') {
    const copy = state === 'sent' ? C.success : state === 'error' ? C.failure : C.unconfigured;
    return (
      <div
        className={state === 'sent' ? styles.outcome : `${styles.outcome} ${styles.outcomeBad}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        ref={statusRef}
      >
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
        <p className={styles.mail}>
          <a href={`mailto:${C.mail}`}>{C.mail}</a>
          <br />
          <span>{C.mailNote}</span>
        </p>
      </div>
    );
  }

  const field = (k, type = 'text') => {
    const f = C.fields[k];
    const bad = touched[k] && errors[k];
    const describedBy = [f.hint ? `${k}-hint` : null, bad ? `${k}-error` : null]
      .filter(Boolean)
      .join(' ');
    return (
      <div className={styles.field} key={k}>
        <label htmlFor={k}>{f.label}</label>
        {f.hint && (
          <p className={styles.hint} id={`${k}-hint`}>
            {f.hint}
          </p>
        )}
        {type === 'textarea' ? (
          <textarea
            id={k}
            data-field={k}
            rows={5}
            value={values[k]}
            onChange={(e) => set(k, e.target.value)}
            onBlur={() => blur(k)}
            aria-invalid={bad ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
          />
        ) : type === 'select' ? (
          <select
            id={k}
            data-field={k}
            value={values[k]}
            onChange={(e) => set(k, e.target.value)}
            onBlur={() => blur(k)}
            aria-invalid={bad ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={k}
            data-field={k}
            type="text"
            value={values[k]}
            onChange={(e) => set(k, e.target.value)}
            onBlur={() => blur(k)}
            aria-invalid={bad ? 'true' : undefined}
            aria-describedby={describedBy || undefined}
          />
        )}
        {bad && (
          <p className={styles.error} id={`${k}-error`}>
            {errors[k]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {field('name')}
      {field('organisation')}
      {field('role')}
      {field('vertical', 'select')}
      {field('region')}
      {field('message', 'textarea')}

      {/* Honeypot. Hidden from sight and from assistive technology; only an
          automated filler will complete it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company_website}
          onChange={(e) => set('company_website', e.target.value)}
        />
      </div>

      <div className={styles.consent}>
        <input
          id="consent"
          data-field="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => set('consent', e.target.checked)}
          onBlur={() => blur('consent')}
          aria-invalid={touched.consent && errors.consent ? 'true' : undefined}
          aria-describedby="consent-hint"
        />
        <div>
          <label htmlFor="consent">{C.fields.consent.label}</label>
          <p className={styles.hint} id="consent-hint">
            {C.fields.consent.hint}
          </p>
          {touched.consent && errors.consent && (
            <p className={styles.error}>{errors.consent}</p>
          )}
        </div>
      </div>

      <button className="cta" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? C.submitting : C.submit}
      </button>
    </form>
  );
}
