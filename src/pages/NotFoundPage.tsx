import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

import { PageHeader } from "@/components/layout/PageHeader"
import { buttonVariants } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        path="/not found"
        title="页面不存在"
        description="这个地址没有对应的页面，回到月历继续安排吧。"
        actions={
          <Link
            to="/calendar"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft data-icon="inline-start" />
            返回月历
          </Link>
        }
      />
    </div>
  )
}
