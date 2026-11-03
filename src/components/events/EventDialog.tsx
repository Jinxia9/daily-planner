import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EventForm } from "@/components/events/EventForm"
import { formatDateKey, formatLongDate } from "@/lib/date"
import type { Category } from "@/types/category"
import type { CreateEventInput, Event } from "@/types/event"

interface EventDialogProps {
  categories: Category[]
  defaultDate: Date
  event?: Event
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateEventInput) => Promise<void>
  open: boolean
}

export function EventDialog({
  categories,
  defaultDate,
  event,
  onOpenChange,
  onSubmit,
  open,
}: EventDialogProps) {
  const formKey = event
    ? `${event.id}-${event.updatedAt}`
    : `new-${formatDateKey(defaultDate)}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "编辑日程" : "添加日程"}</DialogTitle>
          <DialogDescription>
            {event
              ? "修改后会同步更新月历和当天日程，日程 ID 保持不变。"
              : `${formatLongDate(defaultDate)}。保存后会立即显示在当前页面。`}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          key={formKey}
          categories={categories}
          defaultDate={defaultDate}
          event={event}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
