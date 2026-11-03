import { Fragment } from "react"

import { EventItem } from "@/components/calendar/EventItem"
import { Separator } from "@/components/ui/separator"
import type { Category } from "@/types/category"
import type { Event } from "@/types/event"

interface EventListProps {
  categoryById: Map<string, Category>
  events: Event[]
  onSelectEvent: (event: Event) => void
}

export function EventList({
  categoryById,
  events,
  onSelectEvent,
}: EventListProps) {
  return (
    <div className="flex flex-col">
      {events.map((event, index) => (
        <Fragment key={event.id}>
          <EventItem
            event={event}
            category={categoryById.get(event.categoryId)}
            onSelect={onSelectEvent}
          />
          {index < events.length - 1 && <Separator />}
        </Fragment>
      ))}
    </div>
  )
}
