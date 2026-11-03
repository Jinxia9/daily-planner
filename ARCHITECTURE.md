## 一、技术栈选择及原因

项目采用轻量级前后端分离架构。

前端负责页面展示和交互，Supabase 负责用户认证和云端数据存储，Vercel 负责网站部署。

### 1.1 技术栈总览

| 技术 | 选择 | 主要职责 |
|---|---|---|
| 前端框架 | React | 页面和组件开发 |
| 构建工具 | Vite | 本地开发和项目构建 |
| 开发语言 | TypeScript | 类型定义和业务逻辑 |
| CSS | Tailwind CSS | 页面样式和响应式布局 |
| UI 组件 | shadcn/ui | 提供基础 UI 组件 |
| 图标 | Lucide React | 图标展示 |
| 日期处理 | date-fns | 日期计算和格式化 |
| 路由 | React Router | 页面导航 |
| 数据库 | Supabase PostgreSQL | 数据存储 |
| 用户认证 | Supabase Auth | 用户注册和登录 |
| 数据访问 | Supabase JS Client | 前端访问数据库 |
| 部署 | Vercel | 网站托管 |

### 1.2 React

用途：

- 构建月历页面。
- 构建日程卡片。
- 构建 DDL 卡片。
- 构建日程编辑弹窗。
- 管理页面状态。

选择原因：

- 组件化开发成熟。
- 生态完善。
- 适合交互较多的网页应用。
- Codex 容易理解和修改 React 项目。

### 1.3 Vite

用途：

- 创建开发环境。
- 启动本地开发服务器。
- 构建生产环境文件。

选择原因：

- 配置简单。
- 启动速度快。
- 与 React + TypeScript 配合成熟。

### 1.4 TypeScript

用途：

- 定义 Event、Category、DDLTask 等数据类型。
- 降低数据结构错误。
- 规范组件参数和函数返回值。

选择原因：

项目存在多个关联的数据模型，使用 TypeScript 能够让代码结构更加清晰。

### 1.5 Tailwind CSS + shadcn/ui

Tailwind CSS 负责：

- 页面布局。
- 间距和尺寸。
- 颜色。
- 字体。
- 响应式样式。

shadcn/ui 负责：

- Button。
- Dialog。
- Input。
- Select。
- Calendar。
- Progress。
- Dropdown Menu。

选择原因：

不需要从零开发所有 UI 组件，可以将精力集中在日程管理业务逻辑上。

### 1.6 date-fns

用途：

- 获取月份日期。
- 计算星期。
- 月份切换。
- 日期比较。
- DDL 剩余天数计算。
- 日期格式化。

选择原因：

减少自行编写日期算法带来的错误。

日期比较和剩余天数计算应统一使用项目时区规则，避免不同设备时区造成日期偏差。

### 1.7 Supabase

Supabase 提供：

- PostgreSQL 数据库。
- 用户认证。
- 数据访问 API。
- RLS 数据安全策略。

选择原因：

- 不需要自己搭建后端服务器。
- 支持用户认证。
- 支持关系型数据库。
- 可以满足多设备云端数据同步需求。

V1.0 不单独开发复杂后端服务。

### 1.8 Vercel

用途：

- 部署 React 前端。
- 提供网站访问地址。
- 支持 GitHub 更新后自动部署。

选择原因：

- 与 Vite 项目配合方便。
- 部署流程简单。
- 适合个人项目。

---

## 二、整体技术架构

### 2.1 架构图

```text
              用户
               |
        +------+------+
        |             |
     电脑浏览器     手机浏览器
        |             |
        +------+------+
               |
               v
         Vercel Hosting
               |
               v
        React + Vite
          TypeScript
               |
       +-------+-------+
       |       |       |
    Pages  Components  Hooks
       |       |       |
       +-------+-------+
               |
               v
           Services
               |
               v
       Supabase Client
               |
       +-------+-------+
       |       |       |
      Auth   Database  RLS
               |
       +-------+-------+
       |       |       |
     Events Categories DDL
```

### 2.2 数据流

以新增日程为例：

1. 用户打开新增日程弹窗。
2. 输入日程信息。
3. React 收集表单数据。
4. 前端执行数据验证。
5. 调用 eventService。
6. eventService 使用 Supabase Client 写入数据库。
7. Supabase 检查用户身份和 RLS 权限。
8. 数据保存成功。
9. React 更新页面。
10. 用户在其他设备重新获取数据时看到更新。

### 2.3 架构原则

- 前端只负责展示和交互。
- 数据库读写统一放在 services。
- 数据类型统一放在 types。
- 组件尽量保持单一职责。
- 不在页面组件中直接编写大量 SQL 或数据库操作。
- 不引入不必要的复杂后端架构。

---

## 三、项目目录结构

推荐目录：

```text
daily-planner/
│
├── public/
│   └── favicon.svg
│
├── src/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarHeader.tsx
│   │   │   ├── CalendarGrid.tsx
│   │   │   ├── CalendarDay.tsx
│   │   │   └── EventItem.tsx
│   │   │
│   │   ├── events/
│   │   │   ├── EventDialog.tsx
│   │   │   ├── EventForm.tsx
│   │   │   └── EventDetail.tsx
│   │   │
│   │   ├── ddl/
│   │   │   ├── DDLCard.tsx
│   │   │   ├── DDLForm.tsx
│   │   │   └── DDLProgress.tsx
│   │   │
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── MobileNavigation.tsx
│   │
│   ├── pages/
│   │   ├── CalendarPage.tsx
│   │   ├── DDLPage.tsx
│   │   ├── SettingsPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── hooks/
│   │   ├── useEvents.ts
│   │   ├── useCategories.ts
│   │   ├── useDDL.ts
│   │   └── useAuth.ts
│   │
│   ├── services/
│   │   ├── eventService.ts
│   │   ├── categoryService.ts
│   │   └── ddlService.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── date.ts
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── event.ts
│   │   ├── category.ts
│   │   ├── ddl.ts
│   │   └── database.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── .env.example
├── .env.local
├── .gitignore
├── components.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── PRD.md
└── ARCHITECTURE.md
```

### 3.1 目录说明

| 目录 | 职责 |
|---|---|
| components/ui | shadcn/ui 基础组件 |
| components/calendar | 月历相关组件 |
| components/events | 日程相关组件 |
| components/ddl | DDL 相关组件 |
| components/layout | 页面整体布局 |
| pages | 完整页面 |
| hooks | 可复用的数据和交互逻辑 |
| services | 数据库读写 |
| lib | 基础工具和第三方库初始化 |
| types | TypeScript 类型定义 |
| supabase/migrations | 数据库结构和迁移文件 |

### 3.2 文件职责

**App.tsx**

- 配置页面路由。
- 组织应用整体结构。
- 配置需要登录保护的页面。

**main.tsx**

- React 应用入口。
- 挂载 App。
- 引入全局 CSS。

**lib/supabase.ts**

- 初始化 Supabase Client。
- 统一导出数据库客户端。

**lib/date.ts**

- 封装日期计算函数。
- 统一日期格式。
- 处理 DDL 剩余天数。

**services/**

- 封装数据库 CRUD 操作。
- 统一处理数据库返回结果。
- 不负责页面展示。

**hooks/**

- 调用 services。
- 管理页面需要的数据和加载状态。
- 向组件提供可复用逻辑。

---

## 四、核心模块说明

### 4.1 页面模块

#### CalendarPage

负责：

- 展示当前月份。
- 展示日历网格。
- 月份切换。
- 返回今天。
- 展示日程。
- 查看当天日程。

#### DDLPage

负责：

- 获取 DDL 数据。
- 展示任务卡片。
- 调整任务进度。
- 新增和编辑任务。
- 删除任务。

#### SettingsPage

负责：

- 个人设置。
- 分类管理。
- 退出登录。

#### LoginPage / RegisterPage

负责：

- 用户登录。
- 用户注册。
- 登录错误提示。

### 4.2 日程模块

主要组件：

- EventItem：展示单条日程。
- EventDialog：日程详情和编辑弹窗。
- EventForm：日程输入表单。

主要服务：

eventService.ts

建议提供：

```typescript
getEvents()
getEventsByDate(date)
createEvent(data)
updateEvent(id, data)
deleteEvent(id)
```

### 4.3 分类模块

主要负责：

- 获取分类。
- 新增分类。
- 修改分类。
- 删除分类。
- 提供分类颜色。

主要服务：

categoryService.ts

建议提供：

```typescript
getCategories()
createCategory(data)
updateCategory(id, data)
deleteCategory(id)
```

### 4.4 DDL 模块

主要组件：

- DDLCard：展示任务信息。
- DDLForm：新增和编辑任务。
- DDLProgress：展示任务完成进度。

主要服务：

ddlService.ts

建议提供：

```typescript
getDDLTasks()
createDDLTask(data)
updateDDLTask(id, data)
deleteDDLTask(id)
```

剩余天数建议由前端根据 due_date 和当前日期计算，不必将其作为独立字段存入数据库。

### 4.5 用户认证模块

使用 Supabase Auth。

主要负责：

- 注册。
- 登录。
- 退出登录。
- 获取当前用户。
- 监听登录状态变化。

未登录用户不能访问日程管理页面。

### 4.6 数据同步模块

V1.0 使用 Supabase 云端数据库作为唯一数据来源。

基本机制：

- 写入操作成功后更新当前页面。
- 页面进入时从云端读取数据。
- 切换设备后重新登录即可读取同一账户的数据。
- 不实现复杂的离线冲突处理。
- Supabase Realtime 暂时不作为第一版的必要依赖。

---

## 五、数据模型设计

采用 PostgreSQL 关系型数据库。

V1.0 主要包含三张业务数据表：

1. categories：日程分类。
2. events：日程。
3. ddl_tasks：DDL 任务。

用户身份由 Supabase Auth 管理。

所有业务数据表都通过 user_id 关联当前用户。

### 5.1 categories（分类表）

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | UUID | Primary Key | 分类 ID |
| user_id | UUID | Not Null | 用户 ID |
| name | Text | Not Null | 分类名称 |
| color | Text | Not Null | 分类颜色 |
| created_at | Timestamptz | Not Null | 创建时间 |

建议约束：

- id 默认生成 UUID。
- user_id 关联 auth.users.id。
- 同一用户下分类名称唯一。
- 删除分类时，将关联日程和 DDL 的 category_id 设为 NULL。

### 5.2 events（日程表）

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | UUID | Primary Key | 日程 ID |
| user_id | UUID | Not Null | 用户 ID |
| title | Text | Not Null | 日程标题 |
| event_date | Date | Not Null | 日程日期 |
| start_time | Time | Nullable | 开始时间 |
| end_time | Time | Nullable | 结束时间 |
| category_id | UUID | Nullable | 分类 ID |
| description | Text | Nullable | 备注 |
| created_at | Timestamptz | Not Null | 创建时间 |
| updated_at | Timestamptz | Not Null | 修改时间 |

建议约束：

- title 不能为空。
- event_date 必须填写。
- category_id 可以为空。
- 如果开始时间和结束时间同时填写，结束时间不能早于开始时间。
- category_id 关联 categories.id。
- user_id 关联 auth.users.id。

### 5.3 ddl_tasks（DDL 表）

| 字段 | 类型 | 约束 | 说明 |
|---|---|---|---|
| id | UUID | Primary Key | 任务 ID |
| user_id | UUID | Not Null | 用户 ID |
| title | Text | Not Null | 任务名称 |
| description | Text | Nullable | 任务描述 |
| start_date | Date | Nullable | 开始日期 |
| due_date | Date | Not Null | 截止日期 |
| progress | Integer | Not Null | 完成进度 |
| status | Text | Not Null | 任务状态 |
| category_id | UUID | Nullable | 分类 ID |
| created_at | Timestamptz | Not Null | 创建时间 |
| updated_at | Timestamptz | Not Null | 修改时间 |

建议约束：

- progress 范围为 0-100。
- status 使用 pending、completed 两种状态。
- progress 达到 100 时自动设置为 completed。
- progress 小于 100 时设置为 pending。
- category_id 关联 categories.id。
- user_id 关联 auth.users.id。

### 5.4 数据关系图

```text
       auth.users
           |
           |
       user_id
           |
    +------+------+
    |      |      |
    v      v      v
categories events ddl_tasks
    |      |      |
    +------+------+
       category_id
```

关系说明：

- 一个用户可以拥有多个分类。
- 一个用户可以拥有多条日程。
- 一个用户可以拥有多个 DDL 任务。
- 一个分类可以关联多条日程。
- 一个分类可以关联多个 DDL 任务。
- 日程和 DDL 都可以不选择分类。

### 5.5 RLS 数据安全

三张业务表全部启用 Row Level Security。

每张表至少需要配置以下操作的权限：

- SELECT：只能读取自己的数据。
- INSERT：只能以自己的 user_id 创建数据。
- UPDATE：只能修改自己的数据。
- DELETE：只能删除自己的数据。

核心判断条件：

```sql
auth.uid() = user_id
```

INSERT 和 UPDATE 还需要使用 WITH CHECK 确保写入的 user_id 与当前登录用户一致。

此外，外键关联应避免跨用户引用其他人的分类。

前端不能代替数据库权限检查。

### 5.6 日期存储规则

- 日程日期使用 PostgreSQL DATE。
- DDL 开始日期和截止日期使用 DATE。
- 日程开始时间和结束时间使用 TIME。
- created_at 和 updated_at 使用 TIMESTAMPTZ。
- 日期显示统一遵循项目指定的时区规则。

剩余天数应基于日期计算，而不是直接用两个时间戳相减，以避免时区和夏令时问题。

### 5.7 索引建议

为常用查询建立索引：

- events(user_id, event_date)
- ddl_tasks(user_id, due_date)
- categories(user_id)

这样能够提高用户查询自己日程和 DDL 的效率。

---

## 六、代码规范

### 6.1 命名规范

| 类型 | 命名方式 | 示例 |
|---|---|---|
| React 组件 | PascalCase | CalendarGrid.tsx |
| 函数 | camelCase | getEvents() |
| 变量 | camelCase | currentDate |
| 类型接口 | PascalCase | Event |
| 常量 | UPPER_SNAKE_CASE | DEFAULT_CATEGORY |
| CSS 类名 | Tailwind 工具类 | flex items-center |

### 6.2 组件开发规范

1. 一个组件尽量只负责一类功能。
2. 页面组件负责组织页面。
3. 业务组件负责具体展示和交互。
4. 可复用的逻辑放入 hooks。
5. 数据库操作统一放入 services。
6. 避免组件之间产生不必要的依赖。

不推荐：

```tsx
// 在一个 App.tsx 中完成所有页面、表单和数据库操作
```

推荐：

```tsx
function CalendarPage() {
  // 组织月历页面

  return (
    <div>
      <CalendarHeader />
      <CalendarGrid />
      <EventDialog />
    </div>
  );
}
```

### 6.3 TypeScript 规范

- 优先使用 interface 定义对象类型。
- 避免随意使用 any。
- 函数参数和返回值尽量明确。
- 组件 Props 需要定义类型。
- 数据库返回类型应尽量与业务类型保持一致。

### 6.4 Service 规范

数据库读写统一通过 services 完成。

例如：

```typescript
// eventService.ts

export async function getEvents() {
  // 获取当前用户的日程
}

export async function createEvent(data: CreateEventInput) {
  // 创建日程
}

export async function updateEvent(id: string, data: UpdateEventInput) {
  // 更新日程
}

export async function deleteEvent(id: string) {
  // 删除日程
}
```

注意：以上为结构示例，实际开发时需要补充 Supabase 查询、错误处理和返回类型。

### 6.5 React 状态管理

V1.0 优先使用：

- React useState。
- React useEffect。
- 自定义 Hooks。

暂时不引入 Redux 等复杂状态管理工具。

对于服务端数据：

- 通过 services 获取。
- 通过 hooks 管理加载状态和数据。
- 修改数据后及时更新页面状态。

### 6.6 样式规范

统一使用 Tailwind CSS。

要求：

- 优先使用 Tailwind 工具类。
- 避免大量重复 CSS。
- 公共样式统一管理。
- 手机端使用响应式断点。
- 颜色尽量使用统一的设计变量。
- UI 组件优先使用 shadcn/ui。

### 6.7 错误处理

所有数据库操作都应考虑：

- 网络请求失败。
- 用户未登录。
- 权限不足。
- 数据验证失败。
- 数据不存在。

界面需要提供清晰的错误反馈，不能让操作失败后没有任何提示。

### 6.8 Git 规范

采用功能完成后提交的方式。

提交信息格式：

```text
feat: 新增功能
fix: 修复问题
style: 样式调整
refactor: 代码重构
docs: 更新文档
chore: 项目维护
```

示例：

```bash
git add .
git commit -m "feat: add calendar view"
```

---

## 七、开发阶段规划

### 第一阶段：项目初始化

目标：

- 创建 React + Vite 项目。
- 配置 TypeScript。
- 配置 Tailwind CSS。
- 初始化 shadcn/ui。
- 安装 Lucide React 和 date-fns。
- 配置 React Router。
- 建立目录结构。
- 建立三个基础页面。

暂时不接入 Supabase。

### 第二阶段：月历功能

目标：

- 月份切换。
- 返回今天。
- 日期网格。
- 当前日期标记。
- 日程展示占位。

### 第三阶段：日程管理

目标：

- 新增日程。
- 编辑日程。
- 删除日程。
- 查看日程。
- 表单验证。

初期可以使用临时模拟数据进行前端开发，但数据类型应与最终数据库模型保持一致。

### 第四阶段：分类管理

目标：

- 分类新增。
- 分类编辑。
- 分类删除。
- 分类颜色管理。
- 日程分类展示。

### 第五阶段：DDL 管理

目标：

- DDL 新增。
- DDL 编辑。
- DDL 删除。
- 剩余天数计算。
- 任务完成进度。
- 任务状态管理。

### 第六阶段：Supabase 接入

目标：

- 创建数据库。
- 建立数据表。
- 配置 RLS。
- 配置用户认证。
- 接入数据库 CRUD。
- 使用云端数据替换模拟数据。

### 第七阶段：响应式适配

目标：

- 完成电脑端布局。
- 完成手机端布局。
- 优化触屏操作。
- 检查小屏幕显示。
- 测试不同设备的使用体验。

### 第八阶段：部署上线

目标：

- 上传 GitHub。
- 配置 Vercel。
- 配置生产环境变量。
- 部署网站。
- 测试注册和登录。
- 测试日程读写。
- 测试多设备数据同步。
- 检查数据权限。

---

## 八、Codex 开发约束

为了让 Codex 持续按照项目架构开发，需要遵循以下要求：

1. 每次开发前先阅读 README.md、PRD.md 和 ARCHITECTURE.md。
2. 严格遵循现有项目目录结构。
3. 不随意更换技术栈。
4. 不随意增加复杂依赖。
5. 不将所有业务逻辑写在页面组件中。
6. 数据库操作统一放在 services。
7. 新增数据类型时同步更新 types。
8. 修改数据库结构时创建对应 migration 文件。
9. 涉及数据库权限时必须考虑 RLS。
10. 每完成一个阶段，先运行项目并检查功能，再开始下一阶段。
11. 修改代码后运行 npm run build，确保项目可以正常构建。
12. 遇到不明确的需求，先说明问题，不要自行引入复杂功能。

---

## 九、V1.0 架构范围

第一版只实现必要的功能：

- React 前端。
- 月历页面。
- 日程管理。
- 分类管理。
- DDL 管理。
- Supabase 用户认证。
- Supabase 云端数据存储。
- 多设备数据访问。
- Vercel 部署。

暂时不引入：

- 独立 Node.js 后端。
- Redux。
- Docker。
- 微服务。
- 复杂离线同步。
- 实时协作。
- AI 服务。

**架构设计原则：保持简单、模块清晰、方便 Codex 持续开发。**

项目应优先保证核心功能可靠运行，再根据实际使用体验逐步扩展。