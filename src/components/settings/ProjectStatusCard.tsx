import { Cloud, LogOut, RefreshCw } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import { useCalendarData } from "@/hooks/useCalendarData"
import { APP_TIME_ZONE } from "@/lib/date"
import { normalizeDataError } from "@/lib/errors"

export function ProjectStatusCard() {
  const { signOut, user } = useAuth()
  const { refreshData } = useCalendarData()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleRefresh() {
    setErrorMessage(null)
    setIsRefreshing(true)
    try {
      await refreshData()
    } catch (error) {
      setErrorMessage(
        normalizeDataError(error, "刷新数据失败。").message
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  async function handleSignOut() {
    setErrorMessage(null)
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      setErrorMessage(
        normalizeDataError(error, "退出登录失败。").message
      )
      setIsSigningOut(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /cloud account
        </CardDescription>
        <CardTitle>账户与同步</CardTitle>
        <CardAction>
          <Badge variant="outline">SUPABASE</Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Cloud aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user?.email ?? "已登录账户"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              日程、分类和 DDL 会保存到当前账户。
            </p>
          </div>
        </div>

        <dl className="flex flex-col gap-3 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">认证服务</dt>
            <dd className="font-mono text-[10px]">Supabase Auth</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">数据同步</dt>
            <dd className="font-mono text-[10px]">手动刷新</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">项目时区</dt>
            <dd className="font-mono text-[10px]">{APP_TIME_ZONE}</dd>
          </div>
        </dl>

        {errorMessage && (
          <p className="text-xs text-destructive">{errorMessage}</p>
        )}

        <Separator />

        <p className="text-xs leading-relaxed text-muted-foreground">
          在另一台设备完成修改后，点击“刷新数据”获取最新内容。
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing || isSigningOut}
        >
          {isRefreshing ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RefreshCw data-icon="inline-start" />
          )}
          {isRefreshing ? "同步中..." : "刷新数据"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          disabled={isRefreshing || isSigningOut}
        >
          {isSigningOut ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <LogOut data-icon="inline-start" />
          )}
          退出登录
        </Button>
      </CardFooter>
    </Card>
  )
}
