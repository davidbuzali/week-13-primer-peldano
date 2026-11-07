export type AnalyticsEventName =
  | 'session_started'
  | 'demo_opened'
  | 'example_selected'
  | 'mapping_completed'
  | 'provenance_opened'
  | 'boundary_answered'
  | 'adversarial_verdict'
  | 'feedback_submitted'
  | 'log_downloaded'
  | 'session_reset'

export type AnalyticsMetadata = Record<string, string | number | boolean>

export interface AnalyticsEvent {
  sessionId: string
  timestamp: string
  name: AnalyticsEventName
  metadata: AnalyticsMetadata
}

export interface StoredFeedback {
  relationship: 'stranger' | 'known' | 'friend-or-family' | 'synthetic-persona'
  taskVerdict: 'completed' | 'needed-help' | 'stopped'
  adversarialVerdict: 'insufficient' | 'sufficient' | 'unsure'
  boundaryAnswers: Record<string, 'yes' | 'no'>
  allBoundariesCorrect: boolean
  note: string
  consent: true
  savedAt: string
}

export interface LocalAnalyticsState {
  schemaVersion: 'primer-peldano-test/0.1'
  sessionId: string
  events: AnalyticsEvent[]
  feedback?: StoredFeedback
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export const ANALYTICS_STORAGE_KEY = 'primer-peldano:week13:test-session'

const allowedMetadata: Record<AnalyticsEventName, readonly string[]> = {
  session_started: [],
  demo_opened: [],
  example_selected: ['exampleId', 'adversarial'],
  mapping_completed: ['exampleId', 'adversarial', 'fullMatches', 'partialMatches', 'noMatches'],
  provenance_opened: ['criterionId'],
  boundary_answered: ['questionId', 'answer'],
  adversarial_verdict: ['answer'],
  feedback_submitted: ['relationship', 'taskVerdict', 'allBoundariesCorrect'],
  log_downloaded: ['eventCount'],
  session_reset: [],
}

const forbiddenMetadataPattern = /(evidence|text|note|name|email|phone|contact|device|browser|ip|employer)/i

function fallbackId(): string {
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function makeSessionId(): string {
  return globalThis.crypto?.randomUUID?.() ?? fallbackId()
}

export function buildAnalyticsEvent(
  sessionId: string,
  name: AnalyticsEventName,
  metadata: AnalyticsMetadata = {},
  timestamp = new Date().toISOString(),
): AnalyticsEvent {
  const allowed = allowedMetadata[name]
  if (!allowed) throw new Error(`Unknown analytics event: ${name}`)
  for (const key of Object.keys(metadata)) {
    if (!allowed.includes(key) || forbiddenMetadataPattern.test(key)) {
      throw new Error(`Analytics metadata is not allowed: ${key}`)
    }
  }
  return { sessionId, timestamp, name, metadata }
}

export function createLocalAnalyticsState(
  initialEvent: 'session_started' | 'session_reset' = 'session_started',
  sessionId = makeSessionId(),
): LocalAnalyticsState {
  return {
    schemaVersion: 'primer-peldano-test/0.1',
    sessionId,
    events: [buildAnalyticsEvent(sessionId, initialEvent)],
  }
}

export function readLocalAnalytics(storage: StorageLike): LocalAnalyticsState | null {
  const raw = storage.getItem(ANALYTICS_STORAGE_KEY)
  if (!raw) return null
  try {
    const state = JSON.parse(raw) as LocalAnalyticsState
    if (state.schemaVersion !== 'primer-peldano-test/0.1' || !state.sessionId || !Array.isArray(state.events)) return null
    return state
  } catch {
    return null
  }
}

export function getOrCreateLocalAnalytics(storage: StorageLike): LocalAnalyticsState {
  const existing = readLocalAnalytics(storage)
  if (existing) return existing
  const state = createLocalAnalyticsState()
  storage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(state))
  return state
}

export function appendLocalAnalyticsEvent(
  storage: StorageLike,
  state: LocalAnalyticsState,
  name: AnalyticsEventName,
  metadata: AnalyticsMetadata = {},
): LocalAnalyticsState {
  const next = { ...state, events: [...state.events, buildAnalyticsEvent(state.sessionId, name, metadata)] }
  storage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function saveLocalFeedback(
  storage: StorageLike,
  state: LocalAnalyticsState,
  feedback: StoredFeedback,
): LocalAnalyticsState {
  const next = { ...state, feedback }
  storage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(next))
  return next
}

export function resetLocalAnalytics(storage: StorageLike): LocalAnalyticsState {
  storage.removeItem(ANALYTICS_STORAGE_KEY)
  const state = createLocalAnalyticsState('session_reset')
  storage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(state))
  return state
}
