import assert from 'node:assert/strict'
import test from 'node:test'
import { appendLocalAnalyticsEvent, buildAnalyticsEvent, createLocalAnalyticsState, getOrCreateLocalAnalytics, readLocalAnalytics, resetLocalAnalytics, saveLocalFeedback, type StorageLike } from '../src/analytics.ts'
import { allBoundariesCorrect, boundaryChecks, toStoredFeedback, validateFeedback, type FeedbackDraft } from '../src/feedback.ts'

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

const correctAnswers = Object.fromEntries(boundaryChecks.map((check) => [check.id, check.expected]))

const validFeedback: FeedbackDraft = {
  relationship: 'stranger',
  taskVerdict: 'completed',
  adversarialVerdict: 'insufficient',
  boundaryAnswers: correctAnswers,
  note: 'Dudé al principio, pero entendí que el archivo permanece local.',
  consent: true,
}

test('analytics accepts only allow-listed events and metadata', () => {
  const event = buildAnalyticsEvent('session-1', 'example_selected', { exampleId: 'ev-1', adversarial: false }, '2026-11-07T12:00:00.000Z')
  assert.equal(event.name, 'example_selected')
  assert.throws(() => buildAnalyticsEvent('session-1', 'example_selected', { evidenceText: 'secret' }), /not allowed/i)
  assert.throws(() => buildAnalyticsEvent('session-1', 'unknown' as never), /unknown analytics event/i)
})

test('local analytics can be created, appended, saved, read, and reset', () => {
  const storage = new MemoryStorage()
  const created = getOrCreateLocalAnalytics(storage)
  assert.equal(created.events[0].name, 'session_started')

  const appended = appendLocalAnalyticsEvent(storage, created, 'mapping_completed', {
    exampleId: 'ev-1', adversarial: false, fullMatches: 2, partialMatches: 1, noMatches: 1,
  })
  const feedback = toStoredFeedback(validFeedback, '2026-11-07T12:10:00.000Z')
  const saved = saveLocalFeedback(storage, appended, feedback)
  assert.deepEqual(readLocalAnalytics(storage), saved)
  assert.equal(JSON.stringify(saved.events).includes(validFeedback.note), false)

  const reset = resetLocalAnalytics(storage)
  assert.equal(reset.events.length, 1)
  assert.equal(reset.events[0].name, 'session_reset')
  assert.equal(reset.feedback, undefined)
})

test('feedback requires all five checks, bounded safe text, consent, and classifications', () => {
  assert.equal(validateFeedback(validFeedback).length, 0)
  assert.equal(allBoundariesCorrect(validFeedback.boundaryAnswers), true)
  assert.ok(validateFeedback({ ...validFeedback, boundaryAnswers: {} }).some((error) => /cinco/i.test(error)))
  assert.ok(validateFeedback({ ...validFeedback, note: 'a'.repeat(241) }).some((error) => /240/i.test(error)))
  assert.ok(validateFeedback({ ...validFeedback, note: 'Mi correo es persona@example.com' }).some((error) => /personales|sensibles/i.test(error)))
  assert.ok(validateFeedback({ ...validFeedback, consent: false }).some((error) => /confirma/i.test(error)))
})

test('stored feedback records relationship and comprehension without identity', () => {
  const stored = toStoredFeedback(validFeedback, '2026-11-07T12:10:00.000Z')
  assert.equal(stored.relationship, 'stranger')
  assert.equal(stored.allBoundariesCorrect, true)
  assert.deepEqual(Object.keys(stored).sort(), ['adversarialVerdict', 'allBoundariesCorrect', 'boundaryAnswers', 'consent', 'note', 'relationship', 'savedAt', 'taskVerdict'])
})

test('state constructor is deterministic when session id is injected', () => {
  const state = createLocalAnalyticsState('session_started', 'fixed-session')
  assert.equal(state.sessionId, 'fixed-session')
  assert.equal(state.events[0].sessionId, 'fixed-session')
})
