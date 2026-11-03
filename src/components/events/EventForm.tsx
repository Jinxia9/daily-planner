import { Plus, Save } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

import { CategoryPicker } from "@/components/categories/CategoryPicker"
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
import {
  formatDateKey,
  isValidDateKey,
  isValidTimeValue,
} from "@/lib/date"
import { normalizeDataError } from "@/lib/errors"
import { getNotePlaceholder } from "@/lib/notes"
import type { Category } from "@/types/category"
import type { CreateEventInput, Event } from "@/types/event"
import type { NoteType } from "@/types/note"

interface EventFormProps {
  categories: Category[]
  defaultDate: Date
  event?: Event
  onCancel: () => void
  onSubmit: (input: CreateEventInput) => Promise<void>
}

interface FormErrors {
  title?: string
  date?: string
  startTime?: string
  endTime?: string
  categoryId?: string
}

export function EventForm({
  categories,
  defaultDate,
  event,
  onCancel,
  onSubmit,
}: EventFormProps) {
  const id = useId()
  const [title, setTitle] = useState(event?.title ?? "")
  const [date, setDate] = useState(
    event?.date ?? formatDateKey(defaultDate)
  )
  const [startTime, setStartTime] = useState(event?.startTime ?? "")
  const [endTime, setEndTime] = useState(event?.endTime ?? "")
  const [categoryId, setCategoryId] = useState(
    event?.categoryId ?? categories[0]?.id ?? ""
  )
  const [description, setDescription] = useState(
    event?.description ?? ""
  )
  const [noteType, setNoteType] = useState<NoteType>(
    event?.noteType ?? "text"
  )
  const [noteCompleted, setNoteCompleted] = useState(
    event?.noteCompleted ?? false
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function clearError(field: keyof FormErrors) {
    setErrors((currentErrors) =>
      currentErrors[field]
        ? { ...currentErrors, [field]: undefined }
        : currentErrors
    )
  }

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault()
    const normalizedTitle = title.trim()
    const nextErrors: FormErrors = {}

    if (!normalizedTitle) {
      nextErrors.title = "请输入日程名称。"
    }

    if (!isValidDateKey(date)) {
      nextErrors.date = "请选择有效日期。"
    }

    if (startTime && !isValidTimeValue(startTime)) {
      nextErrors.startTime = "请选择有效的开始时间。"
    }

    if (endTime && !isValidTimeValue(endTime)) {
      nextErrors.endTime = "请选择有效的结束时间。"
    }

    if (endTime && !startTime) {
      nextErrors.endTime = "填写结束时间前，请先填写开始时间。"
    } else if (
      startTime &&
      endTime &&
      isValidTimeValue(startTime) &&
      isValidTimeValue(endTime) &&
      endTime <= startTime
    ) {
      nextErrors.endTime = "结束时间必须晚于开始时间。"
    }

    if (
      !categoryId ||
      !categories.some((category) => category.id === categoryId)
    ) {
      nextErrors.categoryId = "请选择日程分类。"
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
        date,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        categoryId,
        description: description.trim() || undefined,
        noteType,
        noteCompleted,
      })
    } catch (error) {
      setSubmitError(
        normalizeDataError(error, "保存日程失败。").message
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor={`${id}-title`}>日程名称</FieldLabel>
          <Input
            id={`${id}-title`}
            value={title}
            onChange={(inputEvent) => {
              setTitle(inputEvent.target.value)
              clearError("title")
            }}
            placeholder="例如：整理项目计划"
            maxLength={60}
            aria-invalid={Boolean(errors.title)}
            aria-required="true"
            autoFocus
          />
          {errors.title && <FieldError>{errors.title}</FieldError>}
        </Field>

        <FieldGroup className="grid gap-4 sm:grid-cols-3">
          <Field data-invalid={Boolean(errors.date)}>
            <FieldLabel htmlFor={`${id}-date`}>日期</FieldLabel>
            <Input
              id={`${id}-date`}
              type="date"
              value={date}
              onChange={(inputEvent) => {
                setDate(inputEvent.target.value)
                clearError("date")
              }}
              aria-invalid={Boolean(errors.date)}
              aria-required="true"
            />
            {errors.date && <FieldError>{errors.date}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.startTime)}>
            <FieldLabel htmlFor={`${id}-start-time`}>
              开始时间
            </FieldLabel>
            <Input
              id={`${id}-start-time`}
              type="time"
              step={300}
              value={startTime}
              onChange={(inputEvent) => {
                setStartTime(inputEvent.target.value)
                clearError("startTime")
                clearError("endTime")
              }}
              aria-invalid={Boolean(errors.startTime)}
            />
            {errors.startTime && (
              <FieldError>{errors.startTime}</FieldError>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.endTime)}>
            <FieldLabel htmlFor={`${id}-end-time`}>
              结束时间
            </FieldLabel>
            <Input
              id={`${id}-end-time`}
              type="time"
              step={300}
              value={endTime}
              onChange={(inputEvent) => {
                setEndTime(inputEvent.target.value)
                clearError("endTime")
              }}
              aria-invalid={Boolean(errors.endTime)}
            />
            {errors.endTime && <FieldError>{errors.endTime}</FieldError>}
          </Field>
        </FieldGroup>

        <Field data-invalid={Boolean(errors.categoryId)}>
          <CategoryPicker
            categories={categories}
            label="日程分类"
            value={categoryId}
            onValueChange={(nextCategoryId) => {
              setCategoryId(nextCategoryId)
              clearError("categoryId")
            }}
          />
          {errors.categoryId && (
            <FieldError>{errors.categoryId}</FieldError>
          )}
        </Field>

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
            onChange={(inputEvent) =>
              setDescription(inputEvent.target.value)
            }
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
          ) : event ? (
            <Save data-icon="inline-start" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {isSaving
            ? "正在保存..."
            : event
              ? "保存修改"
              : "添加日程"}
        </Button>
      </DialogFooter>
    </form>
  )
}
