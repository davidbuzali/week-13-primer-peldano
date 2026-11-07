'use client'

import { useState } from 'react'
import { boundaryChecks, type BoundaryAnswer, type FeedbackDraft } from '@/src/feedback'

const initialDraft: FeedbackDraft = {
  relationship: '',
  taskVerdict: '',
  adversarialVerdict: '',
  boundaryAnswers: {},
  note: '',
  consent: false,
}

export default function FeedbackPanel({
  onBoundaryAnswer,
  onAdversarialVerdict,
  onSubmit,
}: {
  onBoundaryAnswer: (questionId: string, answer: BoundaryAnswer) => void
  onAdversarialVerdict: (answer: NonNullable<FeedbackDraft['adversarialVerdict']>) => void
  onSubmit: (draft: FeedbackDraft) => string[]
}) {
  const [draft, setDraft] = useState<FeedbackDraft>(initialDraft)
  const [errors, setErrors] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const answerBoundary = (questionId: string, answer: BoundaryAnswer) => {
    setDraft((current) => ({ ...current, boundaryAnswers: { ...current.boundaryAnswers, [questionId]: answer } }))
    onBoundaryAnswer(questionId, answer)
    setSaved(false)
  }

  const submit = () => {
    const nextErrors = onSubmit(draft)
    setErrors(nextErrors)
    setSaved(nextErrors.length === 0)
  }

  return (
    <section className="mt-6 rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-6 md:p-8" aria-labelledby="feedback-title">
      <div className="grid gap-7 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--teal)]">Paso 3 · demuestra qué entendiste</p>
          <h2 id="feedback-title" className="display mt-2 text-4xl font-semibold">Cinco límites, sin adivinar.</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--ink-soft)]">Responde según lo que hace este prototipo. En una sesión facilitada, explica cada respuesta en voz alta. Que te guste el producto no cuenta como pasar la prueba.</p>

          <fieldset className="mt-6 space-y-3">
            <legend className="sr-only">Cinco comprobaciones de límites</legend>
            {boundaryChecks.map((check, index) => (
              <div className="rounded-2xl border border-[var(--line)] bg-white p-4" key={check.id}>
                <p className="font-bold leading-6"><span className="mr-2 text-[var(--teal)]">{index + 1}.</span>{check.statement}</p>
                <div className="mt-3 flex gap-3" role="group" aria-label={`Respuesta para límite ${index + 1}`}>
                  {(['yes', 'no'] as const).map((answer) => (
                    <label className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-extrabold ${draft.boundaryAnswers[check.id] === answer ? 'border-[var(--teal)] bg-[var(--teal-soft)]' : 'border-[var(--line)] bg-white'}`} key={answer}>
                      <input className="mr-2 accent-[var(--teal)]" type="radio" name={`boundary-${check.id}`} checked={draft.boundaryAnswers[check.id] === answer} onChange={() => answerBoundary(check.id, answer)} />
                      {answer === 'yes' ? 'Sí' : 'No'}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </div>

        <div className="rounded-2xl bg-[#eaf1f4] p-5 md:p-6">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[var(--teal)]">Retroalimentación anónima</p>
          <h3 className="display mt-2 text-3xl font-semibold">Registra el intento, no una identidad.</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">Se guarda solo en este dispositivo. No escribas nombres, teléfonos, correos, identificaciones ni datos de salud.</p>

          <label className="mt-5 block text-sm font-extrabold">
            Relación con quien facilita
            <select className="mt-2 w-full rounded-xl border border-[var(--line)] bg-white p-3 font-normal" value={draft.relationship} onChange={(event) => setDraft((current) => ({ ...current, relationship: event.target.value as FeedbackDraft['relationship'] }))}>
              <option value="">Selecciona una opción</option>
              <option value="stranger">Persona desconocida antes de esta prueba</option>
              <option value="known">Conocido/a</option>
              <option value="friend-or-family">Amigo/a o familiar</option>
              <option value="synthetic-persona">Persona sintética</option>
            </select>
          </label>

          <fieldset className="mt-5">
            <legend className="text-sm font-extrabold">¿Completaste la tarea sin ayuda?</legend>
            <div className="mt-2 grid gap-2">
              {([
                ['completed', 'Sí, sin ayuda'],
                ['needed-help', 'Necesité ayuda'],
                ['stopped', 'Me detuve'],
              ] as const).map(([value, label]) => (
                <label className="rounded-xl border border-[var(--line)] bg-white p-3 text-sm" key={value}>
                  <input className="mr-2 accent-[var(--teal)]" type="radio" name="task-verdict" checked={draft.taskVerdict === value} onChange={() => setDraft((current) => ({ ...current, taskVerdict: value }))} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-extrabold">¿La lista de palabras basta para una decisión?</legend>
            <div className="mt-2 grid gap-2">
              {([
                ['insufficient', 'No, es insuficiente'],
                ['sufficient', 'Sí, parece suficiente'],
                ['unsure', 'No estoy seguro/a'],
              ] as const).map(([value, label]) => (
                <label className="rounded-xl border border-[var(--line)] bg-white p-3 text-sm" key={value}>
                  <input className="mr-2 accent-[var(--teal)]" type="radio" name="adversarial-verdict" checked={draft.adversarialVerdict === value} onChange={() => { setDraft((current) => ({ ...current, adversarialVerdict: value })); onAdversarialVerdict(value) }} />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 block text-sm font-extrabold">
            ¿Dónde dudaste o te habrías salido? (opcional)
            <textarea className="mt-2 min-h-24 w-full rounded-xl border border-[var(--line)] bg-white p-3 font-normal leading-6" maxLength={240} value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} />
            <span className="mt-1 block text-right font-normal text-[var(--ink-soft)]">{draft.note.length}/240</span>
          </label>

          <label className="mt-4 flex cursor-pointer gap-3 rounded-xl border border-[var(--line)] bg-white p-4 text-sm leading-6">
            <input className="mt-1 h-5 w-5 accent-[var(--teal)]" type="checkbox" checked={draft.consent} onChange={(event) => setDraft((current) => ({ ...current, consent: event.target.checked }))} />
            <span>Quiero guardar esta respuesta localmente para esta prueba. Entiendo que no se envía a una empresa.</span>
          </label>

          <button className="mt-5 w-full rounded-xl bg-[var(--teal)] px-5 py-4 font-extrabold text-white" type="button" onClick={submit}>Guardar respuesta en este dispositivo</button>
          {errors.length > 0 && <ul className="mt-4 space-y-1 text-sm font-bold text-[var(--red)]" role="alert">{errors.map((error) => <li key={error}>- {error}</li>)}</ul>}
          {saved && <p className="mt-4 rounded-xl bg-[var(--teal-soft)] p-4 text-sm font-bold text-[var(--teal)]" role="status">Respuesta guardada localmente. Descarga el registro al terminar la sesión.</p>}
        </div>
      </div>
    </section>
  )
}
