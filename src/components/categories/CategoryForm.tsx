import { Plus, Save } from "lucide-react"
import { useId, useState, type FormEvent } from "react"

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
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { ACCENT_BACKGROUND } from "@/lib/accent"
import { normalizeDataError } from "@/lib/errors"
import { cn } from "@/lib/utils"
import { CATEGORY_COLOR_OPTIONS } from "@/data/categoryColors"
import type {
  Category,
  CategoryColor,
  CategoryInput,
} from "@/types/category"

interface CategoryFormProps {
  categories: Category[]
  category?: Category
  onCancel: () => void
  onSubmit: (input: CategoryInput) => Promise<void>
}

export function CategoryForm({
  categories,
  category,
  onCancel,
  onSubmit,
}: CategoryFormProps) {
  const id = useId()
  const [name, setName] = useState(category?.name ?? "")
  const [color, setColor] = useState<CategoryColor>(
    category?.color ?? "blue"
  )
  const [nameError, setNameError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = name.trim()

    if (!normalizedName) {
      setNameError("请输入分类名称。")
      return
    }

    const hasDuplicateName = categories.some(
      (item) =>
        item.id !== category?.id &&
        item.name.trim().toLocaleLowerCase("zh-CN") ===
          normalizedName.toLocaleLowerCase("zh-CN")
    )

    if (hasDuplicateName) {
      setNameError("分类名称已存在，请换一个名称。")
      return
    }

    setSubmitError(null)
    setIsSaving(true)

    try {
      await onSubmit({ name: normalizedName, color })
    } catch (error) {
      setSubmitError(
        normalizeDataError(error, "保存分类失败。").message
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field data-invalid={Boolean(nameError)}>
          <FieldLabel htmlFor={`${id}-name`}>分类名称</FieldLabel>
          <Input
            id={`${id}-name`}
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              if (nameError) {
                setNameError(null)
              }
            }}
            placeholder="例如：阅读"
            maxLength={24}
            aria-invalid={Boolean(nameError)}
            aria-required="true"
            autoFocus
          />
          {nameError && <FieldError>{nameError}</FieldError>}
        </Field>

        <Field>
          <FieldTitle id={`${id}-color-label`}>分类颜色</FieldTitle>
          <ToggleGroup
            value={[color]}
            onValueChange={(values) => {
              if (values[0]) {
                setColor(values[0] as CategoryColor)
              }
            }}
            variant="outline"
            size="sm"
            spacing={2}
            aria-labelledby={`${id}-color-label`}
            className="flex-wrap"
          >
            {CATEGORY_COLOR_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={`选择${option.label}`}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 rounded-full",
                    ACCENT_BACKGROUND[option.value]
                  )}
                />
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
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
          ) : category ? (
            <Save data-icon="inline-start" />
          ) : (
            <Plus data-icon="inline-start" />
          )}
          {isSaving
            ? "正在保存..."
            : category
              ? "保存修改"
              : "创建分类"}
        </Button>
      </DialogFooter>
    </form>
  )
}
