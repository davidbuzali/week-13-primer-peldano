import type { StoredFeedback } from './analytics'

export type BoundaryAnswer = 'yes' | 'no'

export interface BoundaryCheck {
  id: string
  statement: string
  expected: BoundaryAnswer
}

export const boundaryChecks: BoundaryCheck[] = [
  { id: 'fictional', statement: 'La vacante, la empresa, las personas y la evidencia de este ejercicio son inventadas.', expected: 'yes' },
  { id: 'verification', statement: 'Una coincidencia de términos verifica que la evidencia es verdadera y suficiente.', expected: 'no' },
  { id: 'local-file', statement: 'Guardar una copia descarga el archivo en este dispositivo; no lo envía a una empresa.', expected: 'yes' },
  { id: 'human-decision', statement: 'Una persona debe revisar la evidencia y tomar cualquier decisión.', expected: 'yes' },
  { id: 'automatic-transfer', statement: 'El sitio manda automáticamente mis respuestas o archivos a un empleador.', expected: 'no' },
]

export interface FeedbackDraft {
  relationship: '' | StoredFeedback['relationship']
  taskVerdict: '' | StoredFeedback['taskVerdict']
  adversarialVerdict: '' | StoredFeedback['adversarialVerdict']
  boundaryAnswers: Record<string, BoundaryAnswer>
  note: string
  consent: boolean
}

const sensitivePattern = /(?:\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?52\s?)?(?:\d[\s-]?){10}\b|\b(?:contrase(?:ñ|n)a|password|nip|cvv|curp|rfc|nss|clabe|tarjeta)\b)/i

export function allBoundariesCorrect(answers: Record<string, BoundaryAnswer>): boolean {
  return boundaryChecks.every((check) => answers[check.id] === check.expected)
}

export function validateFeedback(draft: FeedbackDraft): string[] {
  const errors: string[] = []
  if (!draft.relationship) errors.push('Elige tu relación con la persona que facilita la prueba.')
  if (!draft.taskVerdict) errors.push('Indica si completaste la tarea sin ayuda.')
  if (!draft.adversarialVerdict) errors.push('Responde si el ejemplo de palabras es suficiente.')
  if (!boundaryChecks.every((check) => draft.boundaryAnswers[check.id])) errors.push('Responde las cinco comprobaciones de límites.')
  if (draft.note.length > 240) errors.push('La nota supera 240 caracteres.')
  if (sensitivePattern.test(draft.note)) errors.push('La nota parece incluir datos personales o sensibles; elimínalos.')
  if (!draft.consent) errors.push('Confirma que deseas guardar esta respuesta solo en este dispositivo.')
  return errors
}

export function toStoredFeedback(draft: FeedbackDraft, savedAt = new Date().toISOString()): StoredFeedback {
  const errors = validateFeedback(draft)
  if (errors.length > 0) throw new Error(errors.join(' '))
  return {
    relationship: draft.relationship as StoredFeedback['relationship'],
    taskVerdict: draft.taskVerdict as StoredFeedback['taskVerdict'],
    adversarialVerdict: draft.adversarialVerdict as StoredFeedback['adversarialVerdict'],
    boundaryAnswers: draft.boundaryAnswers,
    allBoundariesCorrect: allBoundariesCorrect(draft.boundaryAnswers),
    note: draft.note.trim(),
    consent: true,
    savedAt,
  }
}
