import { Hourglass, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import {
  addMonths,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns"
import { useCallback, useMemo, useState } from "react"

import { CalendarPanel } from "@/components/calendar/CalendarPanel"
import { MonthlyDDLSummary } from "@/components/calendar/MonthlyDDLSummary"
import { SelectedDatePanel } from "@/components/calendar/SelectedDatePanel"
import { EventDetailDialog } from "@/components/events/EventDetailDialog"
import { EventDialog } from "@/components/events/EventDialog"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button, buttonVariants } from "@/components/ui/button"
import { useCalendarData } from "@/hooks/useCalendarData"
import { useCurrentDate } from "@/hooks/useCurrentDate"
import { getDateInMonthClamped } from "@/lib/date"
import { getEventsForDate, groupEventsByDate } from "@/lib/events"
import type { CreateEventInput, Event } from "@/types/event"

type EditorState =
  | { mode: "create"; date: Date }
  | { mode: "edit"; event: Event }
  | null

export function CalendarPage() {
  const {
    categories,
    categoryById,
    events,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarData()
  const today = useCurrentDate()
  const [visibleMonth, setVisibleMonth] = useState(() =>
    startOfMonth(today)
  )
  const [selectedDate, setSelectedDate] = useState(() => today)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    []
  )
  const [editor, setEditor] = useState<EditorState>(null)
  const [detailEventId, setDetailEventId] = useState<string | null>(null)

  const filteredEvents = useMemo(
    () =>
      selectedCategoryIds.length === 0
        ? events
        : events.filter((event) =>
            selectedCategoryIds.includes(event.categoryId)
          ),
    [events, selectedCategoryIds]
  )
  const eventsByDate = useMemo(
    () => groupEventsByDate(filteredEvents),
    [filteredEvents]
  )
  const selectedDateEvents = getEventsForDate(eventsByDate, selectedDate)
  const detailEvent =
    (detailEventId
      ? events.find((event) => event.id === detailEventId)
      : undefined) ?? null

  const selectDate = useCallback((date: Date) => {
    const normalizedDate = startOfDay(date)
    setSelectedDate(normalizedDate)
    setVisibleMonth(startOfMonth(normalizedDate))

    if (window.matchMedia("(max-width: 767px)").matches) {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document
            .getElementById("selected-date-details")
            ?.scrollIntoView({
              behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
              ).matches
                ? "auto"
                : "smooth",
              block: "start",
            })
        })
      })
    }
  }, [])

  const moveMonth = useCallback(
    (offset: number) => {
      const nextMonth = startOfMonth(addMonths(visibleMonth, offset))
      setVisibleMonth(nextMonth)
      setSelectedDate((currentDate) =>
        getDateInMonthClamped(currentDate, nextMonth)
      )
    },
    [visibleMonth]
  )

  const goToToday = useCallback(() => {
    setVisibleMonth(startOfMonth(today))
    setSelectedDate(today)
  }, [today])

  const openCreateDialog = useCallback(() => {
    if (categories.length === 0) {
      return
    }

    setEditor({ mode: "create", date: selectedDate })
  }, [categories.length, selectedDate])

  const openEditDialog = useCallback((event: Event) => {
    setDetailEventId(null)
    setEditor({ mode: "edit", event })
  }, [])

  const openEventDetail = useCallback((event: Event) => {
    setDetailEventId(event.id)
  }, [])

  const saveEvent = useCallback(
    async (input: CreateEventInput) => {
      if (editor?.mode === "edit") {
        await updateEvent(editor.event.id, input)
      } else {
        await createEvent(input)
      }

      const targetDate = startOfDay(parseISO(input.date))
      setSelectedDate(targetDate)
      setVisibleMonth(startOfMonth(targetDate))
      setSelectedCategoryIds((currentIds) =>
        currentIds.length === 0 || currentIds.includes(input.categoryId)
          ? currentIds
          : [...currentIds, input.categoryId]
      )
      setEditor(null)
    },
    [createEvent, editor, updateEvent]
  )

  const removeEvent = useCallback(
    async (eventId: string) => {
      await deleteEvent(eventId)
      setDetailEventId((currentEventId) =>
        currentEventId === eventId ? null : currentEventId
      )
    },
    [deleteEvent]
  )

  const editorDate =
    editor?.mode === "edit"
      ? parseISO(editor.event.date)
      : (editor?.date ?? selectedDate)
  const canCreateEvent = categories.length > 0

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        path="/calendar"
        title="月历"
        actions={
          <>
            <Button
              size="sm"
              onClick={openCreateDialog}
              disabled={!canCreateEvent}
              title={canCreateEvent ? undefined : "请先在设置中创建分类"}
            >
              <Plus data-icon="inline-start" />
              添加日程
            </Button>
            <Link
              to="/ddl"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Hourglass data-icon="inline-start" />
              打开 DDL
            </Link>
          </>
        }
      />

      <div className="mt-6 grid flex-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <CalendarPanel
          categoryById={categoryById}
          categories={categories}
          eventsByDate={eventsByDate}
          month={visibleMonth}
          selectedCategoryIds={selectedCategoryIds}
          selectedDate={selectedDate}
          today={today}
          onCategoryFilterChange={setSelectedCategoryIds}
          onNextMonth={() => moveMonth(1)}
          onPreviousMonth={() => moveMonth(-1)}
          onSelectDate={selectDate}
          onToday={goToToday}
        />
        <div className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-8">
          <SelectedDatePanel
            canAddEvent={canCreateEvent}
            categoryById={categoryById}
            events={selectedDateEvents}
            selectedDate={selectedDate}
            today={today}
            onQuickAdd={openCreateDialog}
            onSelectEvent={openEventDetail}
          />
          <MonthlyDDLSummary month={visibleMonth} />
        </div>
      </div>

      <EventDialog
        categories={categories}
        defaultDate={editorDate}
        event={editor?.mode === "edit" ? editor.event : undefined}
        open={editor !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditor(null)
          }
        }}
        onSubmit={saveEvent}
      />

      <EventDetailDialog
        event={detailEvent}
        category={
          detailEvent
            ? categoryById.get(detailEvent.categoryId)
            : undefined
        }
        onClose={() => setDetailEventId(null)}
        onDelete={removeEvent}
        onEdit={openEditDialog}
      />
    </div>
  )
}
