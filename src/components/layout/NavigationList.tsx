import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useLocation } from "react-router-dom"

import { NavigationItem } from "@/components/layout/NavigationItem"
import { APP_NAVIGATION } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface NavigationListProps {
  className?: string
  iconOnly?: boolean
  variant: "sidebar" | "tablet" | "mobile"
}

interface IndicatorState {
  height: number
  left: number
  ready: boolean
  top: number
  width: number
}

export function NavigationList({
  className,
  iconOnly = false,
  variant,
}: NavigationListProps) {
  const { pathname } = useLocation()
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const activeIndex = Math.max(
    0,
    APP_NAVIGATION.findIndex((item) => pathname.startsWith(item.path))
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [indicator, setIndicator] = useState<IndicatorState>({
    height: 0,
    left: 0,
    ready: false,
    top: 0,
    width: 0,
  })
  const highlightedIndex = hoveredIndex ?? activeIndex

  const moveIndicatorTo = useCallback((index: number) => {
    const item = itemRefs.current[index]
    if (!item) {
      return
    }

    setIndicator({
      height: item.offsetHeight,
      left: item.offsetLeft,
      ready: true,
      top: item.offsetTop,
      width: item.offsetWidth,
    })
  }, [])

  useLayoutEffect(() => {
    moveIndicatorTo(activeIndex)

    const observer = new ResizeObserver(() => {
      moveIndicatorTo(activeIndex)
    })
    for (const item of itemRefs.current) {
      if (item) {
        observer.observe(item)
      }
    }

    return () => observer.disconnect()
  }, [activeIndex, moveIndicatorTo])

  function highlight(index: number) {
    setHoveredIndex(index)
    moveIndicatorTo(index)
  }

  function restoreActiveItem() {
    setHoveredIndex(null)
    moveIndicatorTo(activeIndex)
  }

  return (
    <nav
      data-layout-nav={variant === "mobile" ? "mobile" : undefined}
      aria-label="主要导航"
      className={cn(
        "relative flex",
        variant === "sidebar"
          ? "w-14 flex-col items-center gap-1"
          : variant === "tablet"
            ? "w-full flex-col gap-2"
            : "w-full flex-row gap-1",
        className
      )}
      onPointerLeave={restoreActiveItem}
    >
      <span
        aria-hidden="true"
        data-nav-slider
        className={cn(
          "nav-slide-indicator pointer-events-none absolute top-0 left-0 rounded-full bg-accent-red",
          variant === "tablet" ? "h-16" : "h-14",
          !indicator.ready && "opacity-0"
        )}
        style={{
          height: indicator.height,
          transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
          width: indicator.width,
        }}
      />

      {APP_NAVIGATION.map((item, index) => (
        <div
          key={item.path}
          className={variant === "mobile" ? "min-w-0 flex-1" : undefined}
          ref={(element) => {
            itemRefs.current[index] = element
          }}
          onPointerEnter={() => highlight(index)}
          onPointerDown={() => highlight(index)}
          onFocusCapture={() => highlight(index)}
          onBlurCapture={(event) => {
            if (
              !event.currentTarget.contains(
                event.relatedTarget as Node | null
              )
            ) {
              setHoveredIndex(null)
              moveIndicatorTo(activeIndex)
            }
          }}
        >
          <NavigationItem
            iconOnly={iconOnly}
            item={item}
            variant={variant}
            highlighted={highlightedIndex === index}
          />
        </div>
      ))}
    </nav>
  )
}
