import { useEffect, type ReactNode } from "react"

import { BrandMark } from "@/components/layout/BrandMark"

interface AuthShellProps {
  children: ReactNode
  description: string
  title: string
}

export function AuthShell({
  children,
  description,
  title,
}: AuthShellProps) {
  useEffect(() => {
    document.title = `${title} · Daily Planner`
  }, [title])

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
      <section className="flex min-h-[18rem] flex-col border-b px-6 py-6 sm:px-10 lg:min-h-svh lg:border-r lg:border-b-0 lg:px-14 lg:py-10">
        <BrandMark />
        <div className="my-auto max-w-2xl py-12">
          <p className="font-mono text-xs tracking-[0.04em] text-muted-foreground">
            /your time, in one place
          </p>
          <h1 className="mt-5 text-[clamp(2.8rem,6vw,6.3rem)] leading-[0.9] font-medium tracking-[-0.04em]">
            把事情安放好，
            <br />
            留一点余地。
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            月历、日程分类和 DDL 进度使用同一个账户同步，在不同设备上继续保持自己的节奏。
          </p>
        </div>
        <p className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
          DAILY PLANNER / PERSONAL WORKSPACE
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-5">
            <h2 className="text-2xl font-medium tracking-[-0.04em]">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          {children}
        </div>
      </section>
    </main>
  )
}
