import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EventDetail } from "@/components/events/EventDetail"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface EventDetailDialogProps {
  category?: Category
  event: Event | null
  onClose: () => void
  onDelete: (eventId: string) => Promise<void>
  onEdit: (event: Event) => void
}

export function EventDetailDialog({
  category,
  event,
  onClose,
  onDelete,
  onEdit,
}: EventDetailDialogProps) {
  if (!event) {
    return null
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <p className="font-mono text-[10px] tracking-[0.06em] text-muted-foreground">
            /event detail
          </p>
          <DialogTitle className="text-xl tracking-[-0.03em]">
            {event.title}
          </DialogTitle>
          <DialogDescription>
            查看日程信息，也可以继续编辑或删除。
          </DialogDescription>
        </DialogHeader>
        <EventDetail
          category={category}
          event={event}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </DialogContent>
    </Dialog>
  )
}
