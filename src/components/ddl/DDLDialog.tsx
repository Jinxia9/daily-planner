import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DDLForm } from "@/components/ddl/DDLForm"
import type { DDL, DDLInput } from "@/types/ddl"

interface DDLDialogProps {
  ddl?: DDL
  defaultDeadline: string
  onOpenChange: (open: boolean) => void
  onSubmit: (input: DDLInput) => Promise<void>
  open: boolean
}

export function DDLDialog({
  ddl,
  defaultDeadline,
  onOpenChange,
  onSubmit,
  open,
}: DDLDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{ddl ? "编辑 DDL" : "新增 DDL"}</DialogTitle>
          <DialogDescription>
            {ddl
              ? "修改事项信息、截止日期或当前任务完成进度。"
              : "记录截止日期，并把任务拆成可以持续推进的进度。"}
          </DialogDescription>
        </DialogHeader>
        <DDLForm
          key={ddl ? `${ddl.id}-${ddl.updatedAt}` : "new-ddl"}
          ddl={ddl}
          defaultDeadline={defaultDeadline}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
