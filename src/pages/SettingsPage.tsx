import { CategoryManager } from "@/components/categories/CategoryManager"
import { PageHeader } from "@/components/layout/PageHeader"
import { PreferenceCard } from "@/components/settings/PreferenceCard"
import { ProjectStatusCard } from "@/components/settings/ProjectStatusCard"

export function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        path="/settings"
        title="设置"
        description="管理日程分类、显示偏好和项目数据状态。"
      />

      <div className="mt-6 flex flex-1 flex-col gap-5">
        <CategoryManager />
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <PreferenceCard />
          <ProjectStatusCard />
        </div>
      </div>
    </div>
  )
}
