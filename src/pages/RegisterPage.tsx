import { UserPlus } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/hooks/useAuth"
import { normalizeDataError } from "@/lib/errors"

export function RegisterPage() {
  const { isConfigured, isLoading, signUp, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
    setSuccessMessage(null)

    if (password.length < 6) {
      setErrorMessage("密码至少需要 6 个字符。")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("两次输入的密码不一致。")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signUp(email, password)
      if (result.requiresEmailConfirmation) {
        setSuccessMessage(
          "注册成功。请打开邮箱完成验证，然后返回此处登录。"
        )
      } else {
        navigate("/calendar", { replace: true })
      }
    } catch (error) {
      setErrorMessage(
        normalizeDataError(error, "注册失败，请稍后重试。").message
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="注册"
      description="创建账户后，日程和进度会同步到其他设备。"
    >
      {!isConfigured && <ConfigurationAlert />}

      <Card>
        <CardHeader>
          <CardTitle>创建账户</CardTitle>
          <CardDescription>
            默认分类会在账户创建后自动生成。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="register-email">邮箱</FieldLabel>
                <Input
                  id="register-email"
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
                <FieldLabel htmlFor="register-password">密码</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-required="true"
                  disabled={!isConfigured || isSubmitting}
                />
                <FieldDescription>至少 6 个字符。</FieldDescription>
              </Field>

              <Field data-invalid={Boolean(
                confirmPassword &&
                  password !== confirmPassword
              )}>
                <FieldLabel htmlFor="register-confirm-password">
                  确认密码
                </FieldLabel>
                <Input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  aria-invalid={Boolean(
                    confirmPassword &&
                      password !== confirmPassword
                  )}
                  aria-required="true"
                  disabled={!isConfigured || isSubmitting}
                />
                {confirmPassword && password !== confirmPassword && (
                  <FieldError>两次输入的密码不一致。</FieldError>
                )}
              </Field>

              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>注册失败</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <AlertTitle>请验证邮箱</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
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
                  <UserPlus data-icon="inline-start" />
                )}
                {isSubmitting ? "正在创建账户..." : "创建账户"}
              </Button>
            </FieldGroup>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            已有账户？{" "}
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-foreground"
            >
              返回登录
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
