import { CloudAlert, X } from "lucide-react"
import type { ReactNode } from "react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useCalendarData } from "@/hooks/useCalendarData"

interface DataStateGateProps {
  children: ReactNode
}

export function DataStateGate({ children }: DataStateGateProps) {
  const {
    isLoading,
    loadError,
    mutationError,
    clearMutationError,
    refreshData,
  } = useCalendarData()

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex min-h-64 items-center justify-center gap-3 text-sm text-muted-foreground"
      >
        <Spinner />
        正在从云端加载...
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Alert className="max-w-xl">
          <CloudAlert aria-hidden="true" />
          <AlertTitle>无法加载云端数据</AlertTitle>
          <AlertDescription>{loadError}</AlertDescription>
          <AlertAction>
            <Button
              variant="outline"
              size="xs"
              onClick={() => {
                void refreshData().catch(() => undefined)
              }}
            >
              重试
            </Button>
          </AlertAction>
        </Alert>
      </div>
    )
  }

  return (
    <>
      {mutationError && (
        <Alert variant="destructive" className="mb-5">
          <CloudAlert aria-hidden="true" />
          <AlertTitle>云端操作未完成</AlertTitle>
          <AlertDescription>{mutationError}</AlertDescription>
          <AlertAction>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="关闭错误提示"
              onClick={clearMutationError}
            >
              <X data-icon="inline-start" />
            </Button>
          </AlertAction>
        </Alert>
      )}
      {children}
    </>
  )
}
