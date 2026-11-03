import { LogIn } from "lucide-react"
import { useState, type FormEvent } from "react"
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom"

import { AuthShell } from "@/components/auth/AuthShell"
import { ConfigurationAlert } from "@/components/auth/ConfigurationAlert"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import { normalizeDataError } from "@/lib/errors"

interface LoginLocationState {
  from?: string
}

export function LoginPage() {
  const { isConfigured, isLoading, signIn, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const redirectPath =
    (location.state as LoginLocationState | null)?.from ?? "/calendar"

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        正在检查登录状态...
      </main>
    )
  }

  if (user) {
    return <Navigate to="/calendar" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      await signIn(email, password)
      navigate(redirectPath, { replace: true })
    } catch (error) {
      setErrorMessage(
        normalizeDataError(error, "登录失败，请稍后重试。").message
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="登录"
      description="继续查看你的月历、日程和 DDL。"
    >
      {!isConfigured && <ConfigurationAlert />}

      <Card>
        <CardHeader>
          <CardTitle>欢迎回来</CardTitle>
          <CardDescription>
            使用已注册的邮箱和密码登录。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="login-email">邮箱</FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  aria-required="true"
                  disabled={!isConfigured || isSubmitting}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="login-password">密码</FieldLabel>
                <Input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-required="true"
                  disabled={!isConfigured || isSubmitting}
                />
              </Field>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>登录失败</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={!isConfigured || isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <LogIn data-icon="inline-start" />
                )}
                {isSubmitting ? "正在登录..." : "登录"}
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            还没有账户？{" "}
            <Link
              to="/register"
              className="underline underline-offset-4 hover:text-foreground"
            >
              创建账户
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
