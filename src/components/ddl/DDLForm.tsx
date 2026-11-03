import { Plus, Save } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

import { NoteTypeSelector } from "@/components/notes/NoteTypeSelector"
import { Button } from "@/components/ui/button"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { normalizeDataError } from "@/lib/errors"
import { isValidDateKey, isValidTimeValue } from "@/lib/date"
import { getNotePlaceholder } from "@/lib/notes"
import type { DDL, DDLInput } from "@/types/ddl"
import type { NoteType } from "@/types/note"

interface DDLFormProps {
  ddl?: DDL
  defaultDeadline: string
  onCancel: () => void
  onSubmit: (input: DDLInput) => Promise<void>
}

interface DDLFormErrors {
  title?: string
  deadline?: string
  deadlineTime?: string
}

export function DDLForm({
  ddl,
  defaultDeadline,
  onCancel,
  onSubmit,
}: DDLFormProps) {
  const id = useId()
  const [title, setTitle] = useState(ddl?.title ?? "")
  const [deadline, setDeadline] = useState(
    ddl?.deadline ?? defaultDeadline
  )
  const [deadlineTime, setDeadlineTime] = useState(
    ddl?.deadlineTime ?? ""
  )
  const [description, setDescription] = useState(
    ddl?.description ?? ""
  )
  const [noteType, setNoteType] = useState<NoteType>(
    ddl?.noteType ?? "text"
  )
  const [noteCompleted, setNoteCompleted] = useState(
    ddl?.noteCompleted ?? false
  )
  const [errors, setErrors] = useState<DDLFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedTitle = title.trim()
    const nextErrors: DDLFormErrors = {}

    if (!normalizedTitle) {
      nextErrors.title = "请输入事项名称。"
    }

    if (!isValidDateKey(deadline)) {
      nextErrors.deadline = "请选择有效截止日期。"
    }

    if (deadlineTime && !isValidTimeValue(deadlineTime)) {
      nextErrors.deadlineTime = "请选择有效的截止时间。"
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setSubmitError(null)
    setIsSaving(true)

    try {
      await onSubmit({
        title: normalizedTitle,
        deadline,
        deadlineTime: deadlineTime || undefined,
        description: description.trim() || undefined,
        noteType,
        noteCompleted,
      })
    } catch (error) {
      setSubmitError(
        normalizeDataError(error, "保存 DDL 失败。").message
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor={`${id}-title`}>事项名称</FieldLabel>
          <Input
            id={`${id}-title`}
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              setErrors((current) => ({ ...current, title: undefined }))
            }}
            placeholder="例如：提交课程论文"
            maxLength={80}
            aria-invalid={Boolean(errors.title)}
            aria-required="true"
            autoFocus
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <FieldGroup className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem]">
          <Field data-invalid={Boolean(errors.deadline)}>
            <FieldLabel htmlFor={`${id}-deadline`}>截止日期</FieldLabel>
            <Input
              id={`${id}-deadline`}
              type="date"
              value={deadline}
              onChange={(event) => {
                setDeadline(event.target.value)
                setErrors((current) => ({
                  ...current,
                  deadline: undefined,
                }))
              }}
              aria-invalid={Boolean(errors.deadline)}
              aria-required="true"
            />
            {errors.deadline && (
              <FieldError>{errors.deadline}</FieldError>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.deadlineTime)}>
            <FieldLabel htmlFor={`${id}-deadline-time`}>
              截止时间（可选）
            </FieldLabel>
            <Input
              id={`${id}-deadline-time`}
              type="time"
              step={60}
              value={deadlineTime}
              onChange={(event) => {
                setDeadlineTime(event.target.value)
                setErrors((current) => ({
                  ...current,
                  deadlineTime: undefined,
                }))
              }}
              aria-invalid={Boolean(errors.deadlineTime)}
            />
            {errors.deadlineTime && (
              <FieldError>{errors.deadlineTime}</FieldError>
            )}
          </Field>
        </FieldGroup>

        <Field>
          <FieldLabel htmlFor={`${id}-description`}>备注</FieldLabel>
          <NoteTypeSelector
            value={noteType}
            onValueChange={(nextType) => {
              setNoteType(nextType)
              if (nextType !== "todo") {
                setNoteCompleted(false)
              }
            }}
          />
          <Textarea
            id={`${id}-description`}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={getNotePlaceholder(noteType)}
            rows={4}
            maxLength={500}
          />
        </Field>
      </FieldGroup>

      {submitError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>保存失败</AlertTitle>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <DialogFooter className="mt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          取消
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <Spinner data-icon="inline-start" />
          ) : ddl ? (
            <Save data-icon="inline-start" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {isSaving
            ? "正在保存..."
            : ddl
              ? "保存修改"
              : "添加 DDL"}
        </Button>
      </DialogFooter>
    </form>
  )
}
