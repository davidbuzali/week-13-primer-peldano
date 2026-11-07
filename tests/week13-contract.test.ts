import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const appSource = readFileSync(new URL('../src/components/VentureApp.tsx', import.meta.url), 'utf8')
const feedbackSource = readFileSync(new URL('../src/components/FeedbackPanel.tsx', import.meta.url), 'utf8')
const analyticsSource = readFileSync(new URL('../src/analytics.ts', import.meta.url), 'utf8')
const dataSource = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')

test('public interface exposes Week 13 comprehension boundaries', () => {
  for (const phrase of [
    'Coincidencia de términos',
    'Posible información faltante',
    'Sin coincidencia de términos',
    'Una coincidencia no verifica la historia ni demuestra que la evidencia sea suficiente.',
    'Actividad guardada solo en este dispositivo.',
    'Revisión humana obligatoria',
  ]) assert.match(`${appSource}\n${feedbackSource}`, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.doesNotMatch(appSource, /label:\s*['"]Sustentado['"]/)
})

test('adversarial example is invented and explicitly insufficient', () => {
  assert.match(dataSource, /adversarial:\s*true/)
  assert.match(dataSource, /Texto inventado para probar una limitación del sistema/)
  assert.match(appSource, /palabras correctas, evidencia insuficiente/i)
})

test('analytics has no remote transport and forbids sensitive metadata categories', () => {
  assert.doesNotMatch(analyticsSource, /\bfetch\s*\(|sendBeacon|XMLHttpRequest|WebSocket/)
  assert.match(analyticsSource, /forbiddenMetadataPattern/)
  assert.match(analyticsSource, /evidence\|text\|note\|name\|email\|phone/)
})

test('feedback is local, bounded, and consented', () => {
  assert.match(feedbackSource, /maxLength=\{240\}/)
  assert.match(feedbackSource, /no se envía a una empresa/i)
  assert.match(feedbackSource, /Persona desconocida antes de esta prueba/)
  assert.match(feedbackSource, /type="checkbox"/)
  assert.doesNotMatch(feedbackSource, /<form|action=/)
  assert.match(appSource, /key=\{analyticsState\?\.sessionId/)
  assert.match(appSource, /la descarga sí incluye esa nota local/i)
})
