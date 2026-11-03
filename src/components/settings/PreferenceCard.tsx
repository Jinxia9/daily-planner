import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

export function PreferenceCard() {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /preferences
        </CardDescription>
        <CardTitle>显示与时间</CardTitle>
        <CardDescription>
          为后续持久化设置预留界面，当前控件处于预览状态。
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldSet>
          <FieldLegend className="sr-only">显示与时间偏好</FieldLegend>
          <FieldGroup className="gap-0">
            <Field
              orientation="horizontal"
              data-disabled
              className="border-b py-4 first:pt-0"
            >
              <FieldContent>
                <FieldTitle>每周从周一开始</FieldTitle>
                <FieldDescription>
                  月历网格按周一到周日排列。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="week-starts-monday"
                aria-label="每周从周一开始"
                defaultChecked
                disabled
              />
            </Field>

            <Field
              orientation="horizontal"
              data-disabled
              className="border-b py-4"
            >
              <FieldContent>
                <FieldTitle>24 小时制</FieldTitle>
                <FieldDescription>
                  日程时间使用 09:30、18:00 这样的格式。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="twenty-four-hour-time"
                aria-label="使用 24 小时制"
                defaultChecked
                disabled
              />
            </Field>

            <Field
              orientation="horizontal"
              data-disabled
              className="py-4 last:pb-0"
            >
              <FieldContent>
                <FieldTitle>显示周数</FieldTitle>
                <FieldDescription>
                  在月历左侧显示本年度周数。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="show-week-numbers"
                aria-label="显示周数"
                disabled
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        这些偏好将在设置功能阶段接入本地或云端保存。
      </CardFooter>
    </Card>
  )
}
