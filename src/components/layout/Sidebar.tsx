import { LogOut, RefreshCw } from "lucide-react"
import { useState } from "react"

import { BrandMark } from "@/components/layout/BrandMark"
import { NavigationItem } from "@/components/layout/NavigationItem"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import { useCalendarData } from "@/hooks/useCalendarData"
import { normalizeDataError } from "@/lib/errors"
import { APP_NAVIGATION } from "@/lib/navigation"

export function Sidebar() {
  const { signOut, user } = useAuth()
  const { refreshData } = useCalendarData()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)

  async function handleRefresh() {
    setAccountError(null)
    setIsRefreshing(true)
    try {
      await refreshData()
    } catch (error) {
      setAccountError(
        normalizeDataError(error, "刷新数据失败。").message
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  async function handleSignOut() {
    setAccountError(null)
    setIsSigningOut(true)
    try {
      await signOut()
    } catch (error) {
      setAccountError(
        normalizeDataError(error, "退出登录失败。").message
      )
      setIsSigningOut(false)
    }
  }

  return (
    <aside
      data-layout-nav="desktop"
      className="fixed inset-y-0 left-0 hidden w-[17.5rem] flex-col border-r bg-card/95 px-5 py-6 backdrop-blur lg:flex"
    >
      <BrandMark />

      <div className="mt-10 flex flex-col gap-3">
        <p className="px-3 font-mono text-[10px] tracking-[0.08em] text-muted-foreground">
          /primary navigation
        </p>
        <nav aria-label="主要导航" className="flex flex-col gap-1">
          {APP_NAVIGATION.map((item) => (
            <NavigationItem key={item.path} item={item} variant="sidebar" />
          ))}
        </nav>
      </div>

      <Card size="sm" className="mt-auto">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
              /cloud account
            </CardDescription>
            <Badge variant="outline">CLOUD</Badge>
          </div>
          <CardTitle className="truncate text-sm">
            {user?.email ?? "已登录账户"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {accountError && (
            <p className="text-xs text-destructive">{accountError}</p>
          )}
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
            退出
          </Button>
        </CardFooter>
      </Card>
    </aside>
  )
}
