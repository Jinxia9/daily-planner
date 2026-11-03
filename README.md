# Daily Planner

个人日程、分类与 DDL 管理工具，使用 React、Vite、TypeScript、Tailwind CSS、shadcn/ui 和 Supabase 构建。

## 本地运行

Windows 下可以双击 `一键启动.cmd`，关闭时双击 `一键关闭.cmd`。

命令行方式：

```bash
npm install
npm run dev
```

生产构建与代码检查：

```bash
npm run build
npm run lint
```

## Supabase 配置

1. 在 Supabase 创建项目。
2. 在 SQL Editor 按文件名顺序执行 `supabase/migrations/` 下的全部 SQL 文件。
3. 在 Supabase Authentication 中配置站点地址和允许的 Redirect URL。
4. 将 `.env.example` 复制为 `.env.local`，填写：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. 重新启动开发服务器。

只使用 Anon Key。不要把数据库密码、Service Role Key 或其他服务端密钥放进 Vite 环境变量。

## 用户与数据

- 未登录用户会被重定向到 `/login`。
- 支持注册、登录、退出和刷新后恢复登录状态。
- 新用户由数据库触发器一次性创建默认分类：学习、工作、生活、重要事项。
- 日程、分类和 DDL 均直接从 Supabase 查询和写入。
- 表单只在数据库操作成功后更新界面并关闭。
- 页面提供“刷新数据”操作，用于获取其他设备上的最新修改。
- 第一版没有订阅 Realtime，跨设备同步通过重新加载或“刷新数据”完成。

## RLS 测试

准备两个已确认的测试账户，在 `.env.local` 中增加：

```env
RLS_TEST_EMAIL_A=user-a@example.com
RLS_TEST_PASSWORD_A=...
RLS_TEST_EMAIL_B=user-b@example.com
RLS_TEST_PASSWORD_B=...
```

运行：

```bash
npm run test:rls
```

脚本使用两个普通用户会话和 Anon Key，验证分类、日程和 DDL 的跨账户读取、修改、删除、伪造 user_id 以及跨用户分类引用均被拒绝。

## 页面路由

| 路径 | 页面 |
| --- | --- |
| `/login` | 登录 |
| `/register` | 注册 |
| `/calendar` | 月历首页 |
| `/ddl` | DDL 倒计时 |
| `/settings` | 分类、账户与设置 |

## 目录结构

```text
src/
├── components/
│   ├── auth/
│   ├── calendar/
│   ├── categories/
│   ├── ddl/
│   ├── events/
│   ├── layout/
│   ├── notes/
│   ├── settings/
│   └── ui/
├── contexts/          # Auth 与云端数据状态
├── hooks/             # 页面和上下文 hooks
├── lib/
│   ├── supabase.ts    # 独立 Supabase 客户端入口
│   └── errors.ts      # 用户可读错误处理
├── pages/
├── services/
│   ├── categoryService.ts
│   ├── eventService.ts
│   └── ddlService.ts
└── types/

supabase/
└── migrations/
    ├── 202611030001_initial_schema.sql
    └── 202611030002_note_types.sql

scripts/
└── test-rls.mjs
```

## 当前范围

- 月历支持月份切换、日期选择、分类筛选和日程 CRUD。
- 月历右侧显示当前显示月份的全部 DDL 汇总。
- 分类支持 CRUD；删除有关联日程的分类时，通过数据库 RPC 原子迁移。
- DDL 支持 CRUD、截止倒计时、进度调整、完成和重新开启。
- 日程和 DDL 的备注支持文本、地址和待办三种标识；地址仅保存用户填写内容，不接入地图导航。
- 设置页提供账户信息、手动刷新和退出登录。
- 设置页支持周起始日、12/24 小时制和周数显示，偏好保存在当前浏览器。
- Vercel 生产环境已部署，后续推送 `main` 分支会自动更新。

## Vercel 部署

项目已包含 `vercel.json`：

- Framework Preset：Vite
- Build Command：`npm run build`
- Output Directory：`dist`
- 所有前端子路由回退到 `index.html`
- 附加基础安全响应头

Vercel 环境变量只需要：

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

不要配置数据库密码、`service_role` 或任何服务端私钥。

首次部署完成后，在 Supabase Authentication 的 URL Configuration 中把正式域名加入 Site URL，并将 `https://正式域名/login` 加入 Redirect URLs。

后续发布：

```bash
git add .
git commit -m "feat: describe the change"
git push
```

Vercel 会自动为 `main` 分支创建新的生产部署。

## 响应式布局

- 小于 768px：手机顶部品牌栏 + 底部三项触控导航。
- 768px–1023px：平板紧凑侧轨，保留图标和简短文字。
- 1024px 及以上：完整桌面侧栏与账户区域。
- 手机端选择日期后会自动滚动到当天完整日程。
- 移动端弹窗使用底部面板并限制在可视区域内。
- 触屏按钮、输入框和筛选项均保证至少 44px 的操作区域。
- 页面、月历、DDL 卡片和表单在 375、390、768、1024、1440px 下均无横向页面滚动。
