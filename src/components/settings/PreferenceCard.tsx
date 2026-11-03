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
import { usePreferences } from "@/hooks/usePreferences"

export function PreferenceCard() {
  const { preferences, updatePreferences } = usePreferences()

  return (
    <Card>
      <CardHeader>
        <CardDescription className="font-mono text-[10px] tracking-[0.06em]">
          /preferences
        </CardDescription>
        <CardTitle>显示与时间</CardTitle>
        <CardDescription>
          修改后会立即应用，并自动保存在当前浏览器。
        </CardDescription>
      </CardHeader>

      <CardContent>
        <FieldSet>
          <FieldLegend className="sr-only">显示与时间偏好</FieldLegend>
          <FieldGroup className="gap-0">
            <Field orientation="horizontal" className="border-b py-4 first:pt-0">
              <FieldContent>
                <FieldTitle>每周从周一开始</FieldTitle>
                <FieldDescription>
                  月历网格按周一到周日排列。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="week-starts-monday"
                aria-label="每周从周一开始"
                checked={preferences.weekStartsOnMonday}
                onCheckedChange={(checked) =>
                  updatePreferences({ weekStartsOnMonday: checked })
                }
              />
            </Field>

            <Field orientation="horizontal" className="border-b py-4">
              <FieldContent>
                <FieldTitle>24 小时制</FieldTitle>
                <FieldDescription>
                  日程时间使用 09:30、18:00 这样的格式。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="twenty-four-hour-time"
                aria-label="使用 24 小时制"
                checked={preferences.use24HourTime}
                onCheckedChange={(checked) =>
                  updatePreferences({ use24HourTime: checked })
                }
              />
            </Field>

            <Field orientation="horizontal" className="py-4 last:pb-0">
              <FieldContent>
                <FieldTitle>显示周数</FieldTitle>
                <FieldDescription>
                  在月历左侧显示本年度周数。
                </FieldDescription>
              </FieldContent>
              <Switch
                id="show-week-numbers"
                aria-label="显示周数"
                checked={preferences.showWeekNumbers}
                onCheckedChange={(checked) =>
                  updatePreferences({ showWeekNumbers: checked })
                }
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        偏好仅保存在当前浏览器，不会与 Supabase 账户或其他设备同步。
      </CardFooter>
    </Card>
  )
}
