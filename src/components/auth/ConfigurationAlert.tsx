import { KeyRound } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function ConfigurationAlert() {
  return (
    <Alert className="mb-5">
      <KeyRound aria-hidden="true" />
      <AlertTitle>Supabase 尚未配置</AlertTitle>
      <AlertDescription>
        请在 `.env.local` 中设置 `VITE_SUPABASE_URL` 和
        `VITE_SUPABASE_ANON_KEY`，然后重新启动开发服务。
      </AlertDescription>
    </Alert>
  )
}
