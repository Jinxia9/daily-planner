import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DDLForm } from "@/components/ddl/DDLForm"
import type { Category } from "@/types/category"
import type { DDL, DDLInput } from "@/types/ddl"

interface DDLDialogProps {
  categories: Category[]
  ddl?: DDL
  defaultDeadline: string
  onOpenChange: (open: boolean) => void
  onSubmit: (input: DDLInput) => Promise<void>
  open: boolean
}

export function DDLDialog({
  categories,
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
        </DialogHeader>
        <DDLForm
          key={ddl ? `${ddl.id}-${ddl.updatedAt}` : "new-ddl"}
          categories={categories}
          ddl={ddl}
          defaultDeadline={defaultDeadline}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}
