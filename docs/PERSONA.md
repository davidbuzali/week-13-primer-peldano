# Week 13 preliminary persona record - Primer Peldaño

**Date:** 7 November 2026

## Integrity note

This is a developer-run risk walkthrough using an invented persona. It did **not** occur in a fresh independent chat and therefore is not the completed Layer 1 persona test. It documents what the build currently protects and prepares the exact prompt for the required independent pass. No confusion is attributed to a synthetic user who was not actually run.

## Synthetic persona for the required pass

**Rogelio A. (invented), 52, Estado de México.** Rogelio has decades of maintenance and textile-operations experience from informal arrangements. He uses WhatsApp, reads slowly on his phone, distrusts hiring platforms, and leaves a process when it seems to demand unpaid work or hide who will see his information. He worries that his experience “no cuenta” because the workplace was unfamiliar to employers.

Rogelio is not the reported real worker and contains no real person's data.

## Screen sequence to test

### 1. Real-use stop-state

The page opens blocked and asks for no evidence. The independent persona must explain who needs to act next and whether a real employer is waiting.

Pass boundary: Rogelio says the employer commitment is not real and that he should not enter real evidence.

### 2. Invented practice

After `Abrir demo inventada`, every actor and record is labeled invented. The independent persona must identify that this is practice without a hiring consequence.

Pass boundary: Rogelio does not interpret `Empresa Horizonte` or the vacancy as a real opportunity.

### 3. Honest term map

The old authority-laden labels are gone. Results now say `Coincidencia de términos`, `Posible información faltante`, or `Sin coincidencia de términos`, and every full overlap repeats that it does not establish truth, authorship, quality, or sufficiency.

Pass boundary: Rogelio says a green card is a word-overlap signal, not proof that he qualifies.

### 4. Adversarial example

The `Trampa: lista de palabras` record deliberately contains preferred terms without a coherent action or result. It produces four term matches while the challenge states that the text is insufficient.

Pass boundary: Rogelio rejects the example as insufficient and asks for human clarification or review.

### 5. Local feedback and reset

The five checks cover fictional data, non-verification, local file behavior, human authority, and no automatic transfer. The local panel says events exclude the evidence and note; a downloaded session includes deliberately saved feedback. `Borrar y reiniciar sesión` clears both browser storage and the visible feedback draft.

Pass boundary: Rogelio can say what remains on the device, what a download contains, and that nothing reaches an employer automatically.

## Pre-persona risk register

| Priority | Risk to test | Consequence | Existing safeguard |
|---|---|---|---|
| 1 | Green still feels like approval | False confidence in hiring readiness | Honest labels, repeated non-verification language, adversarial example |
| 2 | “Local” is read as “already sent” | Privacy misunderstanding | Explicit no-transfer language before inputs, export, feedback, and checks |
| 3 | Reset appears to erase but leaves a note | Prior participant's words remain visible | Fixed in deployment 2; feedback remounts on new session ID |
| 4 | Five yes/no answers become rote clicking | Apparent completion without comprehension | Facilitator requires a spoken explanation for each answer |
| 5 | Fictional employer is mistaken for a job | Worker invests real effort for no opportunity | Default stop-state and repeated invented labels |

## Required fresh-chat prompt

> You are Rogelio A., an invented 52-year-old worker in Estado de México. You have decades of maintenance and textile-operations experience from informal arrangements, use WhatsApp, read slowly on your phone, distrust hiring platforms, and abandon processes that demand unpaid work or hide who will see your information. I will show you Primer Peldaño one screen at a time. Attempt the task as Rogelio. Narrate what you think each screen means, what you fear, every word you do not understand, and the exact point where you would leave. Do not be polite to the product and do not invent capabilities you cannot see.

## Completion requirement

Run the prompt in a fresh independent chat, show screenshots in order, preserve every hesitation, and fix the highest-consequence confusion before replacing this preliminary record. Until then, the persona deliverable must remain labeled incomplete.
