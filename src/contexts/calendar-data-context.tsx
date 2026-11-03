import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  CalendarDataContext,
  type CalendarDataContextValue,
} from "@/contexts/calendar-data"
import { useAuth } from "@/hooks/useAuth"
import { normalizeDataError } from "@/lib/errors"
import {
  createCategory as createCategoryRequest,
  deleteCategoryWithReplacement,
  listCategories,
  updateCategory as updateCategoryRequest,
} from "@/services/categoryService"
import {
  createDDL as createDDLRequest,
  deleteDDL as deleteDDLRequest,
  listDDLs,
  setDDLCompleted as setDDLCompletedRequest,
  setDDLNoteCompleted as setDDLNoteCompletedRequest,
  updateDDL as updateDDLRequest,
} from "@/services/ddlService"
import {
  createEvent as createEventRequest,
  deleteEvent as deleteEventRequest,
  listEvents,
  setEventNoteCompleted as setEventNoteCompletedRequest,
  updateEvent as updateEventRequest,
} from "@/services/eventService"
import type {
  Category,
  CategoryInput,
} from "@/types/category"
import type { DDL, DDLInput } from "@/types/ddl"
import type {
  CreateEventInput,
  Event,
  UpdateEventInput,
} from "@/types/event"

interface CalendarDataProviderProps {
  children: ReactNode
}

export function CalendarDataProvider({
  children,
}: CalendarDataProviderProps) {
  const { user } = useAuth()
  const userId = user?.id ?? null
  const [categories, setCategories] = useState<Category[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [ddls, setDDLs] = useState<DDL[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const categoryById = useMemo(
    () =>
      new Map(categories.map((category) => [category.id, category])),
    [categories]
  )

  const fetchRemoteData = useCallback(async () => {
    const [nextCategories, nextEvents, nextDDLs] = await Promise.all([
      listCategories(),
      listEvents(),
      listDDLs(),
    ])

    return {
      categories: nextCategories,
      events: nextEvents,
      ddls: nextDDLs,
    }
  }, [])

  const applyRemoteData = useCallback(
    (data: {
      categories: Category[]
      events: Event[]
      ddls: DDL[]
    }) => {
      setCategories(data.categories)
      setEvents(data.events)
      setDDLs(data.ddls)
    },
    []
  )

  useEffect(() => {
    let isActive = true

    if (!userId) {
      // Local state intentionally mirrors the authenticated remote data source.
      // oxlint-disable-next-line react/set-state-in-effect
      setCategories([])
      setEvents([])
      setDDLs([])
      setLoadError(null)
      setMutationError(null)
      setIsLoading(false)
      setLoadedUserId(null)
      return
    }

    setIsLoading(true)
    setLoadError(null)
    setMutationError(null)
    setCategories([])
    setEvents([])
    setDDLs([])

    fetchRemoteData()
      .then((data) => {
        if (isActive) {
          applyRemoteData(data)
          setLoadedUserId(userId)
        }
      })
      .catch((error) => {
        if (isActive) {
          setLoadError(
            normalizeDataError(error, "加载云端数据失败。").message
          )
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [applyRemoteData, fetchRemoteData, userId])

  const refreshData = useCallback(async () => {
    setIsLoading(true)
    setLoadError(null)

    try {
      applyRemoteData(await fetchRemoteData())
    } catch (error) {
      setLoadError(
        normalizeDataError(error, "刷新云端数据失败。").message
      )
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [applyRemoteData, fetchRemoteData])

  const recordMutationError = useCallback((error: unknown) => {
    const normalizedError = normalizeDataError(error)
    setMutationError(normalizedError.message)
    return normalizedError
  }, [])

  const createCategory = useCallback(
    async (input: CategoryInput) => {
      setMutationError(null)
      try {
        const category = await createCategoryRequest(input)
        setCategories((current) => [...current, category])
        return category
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const updateCategory = useCallback(
    async (categoryId: string, input: CategoryInput) => {
      setMutationError(null)
      try {
        const category = await updateCategoryRequest(categoryId, input)
        setCategories((current) =>
          current.map((item) =>
            item.id === category.id ? category : item
          )
        )
        return category
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const deleteCategory = useCallback(
    async (
      categoryId: string,
      replacementCategoryId?: string
    ) => {
      setMutationError(null)
      try {
        await deleteCategoryWithReplacement(
          categoryId,
          replacementCategoryId
        )
        const updatedAt = new Date().toISOString()
        setCategories((current) =>
          current.filter((category) => category.id !== categoryId)
        )
        setEvents((current) =>
          current.map((event) =>
            event.categoryId === categoryId
              ? {
                  ...event,
                  categoryId: replacementCategoryId as string,
                  updatedAt,
                }
              : event
          )
        )
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const createEvent = useCallback(
    async (input: CreateEventInput) => {
      setMutationError(null)
      try {
        const event = await createEventRequest(input)
        setEvents((current) => [...current, event])
        return event
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const updateEvent = useCallback(
    async (eventId: string, input: UpdateEventInput) => {
      setMutationError(null)
      try {
        const event = await updateEventRequest(eventId, input)
        setEvents((current) =>
          current.map((item) =>
            item.id === event.id ? event : item
          )
        )
        return event
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const deleteEvent = useCallback(
    async (eventId: string) => {
      setMutationError(null)
      try {
        await deleteEventRequest(eventId)
        setEvents((current) =>
          current.filter((event) => event.id !== eventId)
        )
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const setEventNoteCompleted = useCallback(
    async (eventId: string, completed: boolean) => {
      setMutationError(null)
      try {
        const event = await setEventNoteCompletedRequest(
          eventId,
          completed
        )
        setEvents((current) =>
          current.map((item) => (item.id === event.id ? event : item))
        )
        return event
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const createDDL = useCallback(
    async (input: DDLInput) => {
      setMutationError(null)
      try {
        const ddl = await createDDLRequest(input)
        setDDLs((current) => [...current, ddl])
        return ddl
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const updateDDL = useCallback(
    async (ddlId: string, input: DDLInput) => {
      setMutationError(null)
      try {
        const ddl = await updateDDLRequest(ddlId, input)
        setDDLs((current) =>
          current.map((item) => (item.id === ddl.id ? ddl : item))
        )
        return ddl
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const setDDLNoteCompleted = useCallback(
    async (ddlId: string, completed: boolean) => {
      setMutationError(null)
      try {
        const ddl = await setDDLNoteCompletedRequest(ddlId, completed)
        setDDLs((current) =>
          current.map((item) => (item.id === ddl.id ? ddl : item))
        )
        return ddl
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const setDDLCompleted = useCallback(
    async (ddlId: string, completed: boolean) => {
      setMutationError(null)
      try {
        const ddl = await setDDLCompletedRequest(ddlId, completed)
        setDDLs((current) =>
          current.map((item) => (item.id === ddl.id ? ddl : item))
        )
        return ddl
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const deleteDDL = useCallback(
    async (ddlId: string) => {
      setMutationError(null)
      try {
        await deleteDDLRequest(ddlId)
        setDDLs((current) =>
          current.filter((ddl) => ddl.id !== ddlId)
        )
      } catch (error) {
        throw recordMutationError(error)
      }
    },
    [recordMutationError]
  )

  const clearMutationError = useCallback(() => {
    setMutationError(null)
  }, [])

  const value = useMemo<CalendarDataContextValue>(
    () => ({
      categories,
      categoryById,
      events,
      ddls,
      isLoading:
        isLoading ||
        Boolean(userId && loadedUserId !== userId && !loadError),
      loadError,
      mutationError,
      clearMutationError,
      refreshData,
      createCategory,
      updateCategory,
      deleteCategory,
      createEvent,
      updateEvent,
      setEventNoteCompleted,
      deleteEvent,
      createDDL,
      updateDDL,
      setDDLNoteCompleted,
      setDDLCompleted,
      deleteDDL,
    }),
    [
      categories,
      categoryById,
      events,
      ddls,
      isLoading,
      loadedUserId,
      userId,
      loadError,
      mutationError,
      clearMutationError,
      refreshData,
      createCategory,
      updateCategory,
      deleteCategory,
      createEvent,
      updateEvent,
      setEventNoteCompleted,
      deleteEvent,
      createDDL,
      updateDDL,
      setDDLNoteCompleted,
      setDDLCompleted,
      deleteDDL,
    ]
  )

  return (
    <CalendarDataContext.Provider value={value}>
      {children}
    </CalendarDataContext.Provider>
  )
}
