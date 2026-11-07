# Week 13 implementation prompt - Primer Peldaño

## Role

You are the coding agent for Primer Peldaño Week 13. Extend the inherited Next.js prototype without changing the Week 12 repository. Work only in the dedicated Week 13 repository and preserve the employer-before-worker stop-state, invented data, worker control, and human authority.

## Product objective

Turn the evidence-map demo into an honest, instrumented comprehension test for five relevant outsiders. The product must reveal whether a participant can complete one fictional task and explain its limits; it must not optimize for praise or imply that usability validates a hiring pathway.

## Feature 1 - honest result language

- Replace the visible labels `Sustentado`, `Parcial`, and `Sin evidencia` with `Coincidencia de términos`, `Posible información faltante`, and `Sin coincidencia de términos`.
- Keep deterministic matching based only on visible text.
- State beside every result group that overlap is not verification, truth, sufficiency, certification, or a hiring decision.
- Add one deliberately keyword-stuffed invented example. It may trigger overlap states, but the interface must identify it as an adversarial comprehension challenge and ask the participant whether it is sufficient for a hiring decision.

### Acceptance

- The old `Sustentado` label is absent from user-facing source.
- The same input always yields the same result.
- The adversarial example demonstrates why term overlap cannot be treated as evidence quality.

## Feature 2 - local anonymous event log

- Create a typed analytics module backed by `localStorage`.
- Use a random anonymous session ID created on device.
- Allow only the events and categorical metadata declared in `docs/PACKET.md`.
- Never record evidence text, free-text feedback, names, contacts, device identifiers, or IP addresses.
- Let the visitor inspect the event count, download a JSON log, and reset the local session.
- Fail safely when storage is unavailable; the core task must still work.

### Acceptance

- Unit tests reject unknown event names and sensitive metadata keys.
- Browser code does not call a remote analytics endpoint.
- The log is readable, downloadable, resettable, and described as local-only.

## Feature 3 - five boundary checks and feedback

- After mapping, present five yes/no checks covering fictional data, term-match limits, local-only file behavior, human decision authority, and no automatic employer transfer.
- Require every response before feedback submission.
- Add relationship category (`stranger`, `known`, `friend-or-family`, `synthetic-persona`), task verdict, adversarial verdict, one optional note limited to 240 characters, and explicit consent to save the response locally.
- Store the structured response locally and include it only in the user-initiated feedback export. Do not put the note in the event stream.
- Show a clear completion state and the next human-testing instruction.

### Acceptance

- Incomplete checks cannot be submitted.
- Optional note length is enforced in code and UI.
- No form submission leaves the device.
- Relationship category is explicit so the three-stranger requirement can be audited without collecting identity.

## Feature 4 - testability and accessibility

- Preserve semantic headings, labels, status announcements, focus movement, keyboard operation, and a 390-pixel layout without horizontal overflow.
- Add pure logic tests for analytics and feedback validation.
- Add source-contract tests for critical safety phrases and forbidden claims.
- Keep the public app functional when `localStorage` is blocked.

## Security floor

- No secret, real personal data, or service-role key in source or fixtures.
- No production database for this fictional test.
- Validate all bounded inputs and sensitive-looking patterns.
- Keep optional Supabase code inactive and owner-scoped by RLS.
- Label simulated output on screen.

## Test and release plan

1. Run unit tests, type checking, lint, build, and secret scan.
2. Deploy release 1 to the dedicated Week 13 Vercel project and verify anonymous access.
3. Execute the scripted mechanical task on desktop and mobile, document at least one defect, and fix it.
4. Rerun all checks and deploy release 2.
5. Run five real-user sessions separately; at least three participants must be strangers. Do not invent results.
6. Run the independent synthetic-persona pass and fix its highest-consequence confusion.
7. Update `DECISIONS.md` at every session close and keep the next move explicit.

## Commit plan

- `docs: define Week 13 five-user packet`
- `feat: replace proof language with term-match signals`
- `feat: add local comprehension feedback loop`
- `test: verify Week 13 safety and analytics boundaries`
- `fix: resolve highest-risk test confusion`
- `docs: finalize Week 13 submission evidence`

Every commit must be pushed to the dedicated Week 13 GitHub repository. Use at least two Vercel deployments and keep the final tested URL as the URL of record.
