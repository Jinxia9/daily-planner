import { Plus, Save } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

import { DDLProgressControl } from "@/components/ddl/DDLProgressControl"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { clampProgress } from "@/lib/ddl"
import { normalizeDataError } from "@/lib/errors"
import { isValidDateKey } from "@/lib/date"
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
  const [progress, setProgress] = useState(ddl?.progress ?? 0)
  const [description, setDescription] = useState(
    ddl?.description ?? ""
  )
  const [noteType, setNoteType] = useState<NoteType>(
    ddl?.noteType ?? "text"
  )
  const [errors, setErrors] = useState<DDLFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const progressDisabled = ddl?.completed ?? false

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
        progress: clampProgress(progress),
        description: description.trim() || undefined,
        noteType,
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

        <Field>
          <DDLProgressControl
            label="完成进度"
            value={progress}
            disabled={progressDisabled}
            onValueChange={setProgress}
          />
          <FieldDescription>
            这是任务完成进度，不代表时间已经过去多少。
            {progressDisabled
              ? " 重新开启任务后可以继续调整。"
              : ""}
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor={`${id}-description`}>备注</FieldLabel>
          <NoteTypeSelector
            value={noteType}
            onValueChange={setNoteType}
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
