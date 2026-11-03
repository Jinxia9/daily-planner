import { useId, useState } from "react"

import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { clampProgress } from "@/lib/ddl"

interface DDLProgressControlProps {
  disabled?: boolean
  label: string
  onValueChange: (value: number) => void
  value: number
}

export function DDLProgressControl({
  disabled = false,
  label,
  onValueChange,
  value,
}: DDLProgressControlProps) {
  const id = useId()
  const [draftValue, setDraftValue] = useState<string | null>(null)
  const displayedValue = draftValue ?? String(value)

  function updateFromInput(nextValue: string) {
    setDraftValue(nextValue)

    if (nextValue === "") {
      return
    }

    const parsedValue = Number(nextValue)
    if (Number.isFinite(parsedValue)) {
      onValueChange(clampProgress(parsedValue))
    }
  }

  function normalizeInput() {
    const normalizedValue = clampProgress(
      displayedValue === "" ? value : Number(displayedValue)
    )
    setDraftValue(null)
    onValueChange(normalizedValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={`${id}-slider`}
          className="text-xs font-medium"
        >
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={1}
            value={displayedValue}
            onFocus={() => setDraftValue(String(value))}
            onChange={(event) => updateFromInput(event.target.value)}
            onBlur={normalizeInput}
            disabled={disabled}
            aria-label={`${label}百分比`}
            className="h-8 w-16 text-right"
          />
          <span className="font-mono text-[10px] text-muted-foreground">
            %
          </span>
        </div>
      </div>
      <Slider
        id={`${id}-slider`}
        value={value}
        min={0}
        max={100}
        step={1}
        disabled={disabled}
        onValueChange={(nextValue) => {
          const valueToSet = Array.isArray(nextValue)
            ? nextValue[0]
            : nextValue

          if (typeof valueToSet === "number") {
            setDraftValue(null)
            onValueChange(clampProgress(valueToSet))
          }
        }}
        thumbAriaLabel={`${label}滑块`}
      />
    </div>
  )
}
