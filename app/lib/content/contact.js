/* /contact — authored content. [draft — needs review] on every string.

   Register: a procurement officer filling this in is doing due diligence, not
   converting. No urgency, no "get started in minutes", no scarcity, no
   exclamation marks. The page's job is to make it obvious what will happen
   next and what is being collected — both of which a government buyer will
   check before typing their name. */

const PS = 'pending sign-off';

export const contact = {
  hero: {
    eyebrow: 'Request a demonstration',
    title: 'Tell us what you need to evaluate.',
    body:
      'A product specialist arranges a demonstration configured for your vertical and region rather than a general walkthrough. If you are running a procurement exercise or a security review, say so in the message — the questions those require are different, and we would rather prepare for them than answer them badly on the call.',
  },

  fields: {
    name: { label: 'Name', error: 'Enter your name.' },
    organisation: {
      label: 'Organisation',
      hint: 'Department, force, agency or company.',
      error: 'Enter your organisation.',
    },
    role: {
      label: 'Role',
      hint: 'So the demonstration is pitched at the right level of detail.',
      error: 'Enter your role.',
    },
    vertical: {
      label: 'Vertical of interest',
      hint: 'Pre-selected from the page you came from. Change it if it is wrong.',
      error: 'Select a vertical.',
      options: [
        { value: '', label: 'Select…' },
        { value: 'publicSafety', label: 'Public Safety — law enforcement' },
        { value: 'governance', label: 'Governance — administrations and political operations' },
        { value: 'brands', label: 'Brands and enterprises' },
        { value: 'celebrity', label: 'Celebrity and public figures' },
        { value: 'undecided', label: 'Not decided yet' },
      ],
    },
    region: {
      label: 'Region',
      hint: 'State, or country for deployments outside India.',
      error: 'Enter your region.',
    },
    message: {
      label: 'Message',
      hint: 'What you need to evaluate, and any constraints we should know about.',
      error: 'Enter a short message.',
    },
    consent: {
      label:
        'I consent to Blue Cloud Softech Solutions Limited storing these details in order to respond to this request.',
      hint: `Used only to answer this enquiry. Retained for the period set in our data policy [${PS}: retention period for enquiry data]. You will not be added to a mailing list.`,
      error: 'Consent is required before this can be sent.',
    },
  },

  submit: 'Send request',
  submitting: 'Sending…',

  success: {
    title: 'Your request has been recorded.',
    body:
      'A product specialist replies within one working day. If your enquiry is part of a procurement timetable with a fixed date, write to the address below and say so.',
  },

  failure: {
    title: 'The request was not sent.',
    body:
      'Nothing was submitted, so no details have been stored. Please write to the address below and we will answer it the same way.',
  },

  /* Shown when no destination is configured for the build. Honest rather than
     silently pretending a submission succeeded. */
  unconfigured: {
    title: 'This form has no destination configured yet.',
    body:
      'The submission endpoint is [pending: endpoint]. Nothing has been sent and nothing has been stored. Until it is wired, please write to the address below.',
  },

  mail: 'smartapps@bluecloudsoftech.com',
  mailNote: 'A product specialist replies within one working day.',
};
