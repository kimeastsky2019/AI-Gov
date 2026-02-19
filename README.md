# AI Governance Platform

## 실행 방법 (로컬)

### 백엔드 (포트 3001)

```bash
cd server
npm install
npm run build
node dist/index.js
```

- 상태 확인: `http://localhost:3001/api/health`

### 프론트엔드 (개발 모드)

```bash
npm install
npm run dev
```

- 접속: `http://localhost:8080`
- 프론트 개발 서버는 `/api` 요청을 `http://localhost:3001`로 프록시합니다. (see `vite.config.ts`)
- 한 번에 띄우기: `npm run dev:full` (프론트+백엔드 동시 실행)

## 운영(프로덕션) 동작 방식

- 프론트는 `npm run build`로 **repo root의 `dist/`**에 빌드됩니다.
- 백엔드는 `NODE_ENV=production`일 때 `dist/`를 정적 서빙합니다. 따라서 운영 서버에서는 SPA 라우트로 `"/ai-intelligence"` 경로 접근이 가능합니다.

예시:

```bash
# 1) 프론트 빌드 (repo root)
npm install
npm run build

# 2) 백엔드 빌드/실행 (server)
cd server
npm install
npm run build
NODE_ENV=production node dist/index.js
```

그 후:
- `http://localhost:3001/ai-intelligence`

## 환경변수 (server/.env)

- **Grok(xAI) 연동**: `server/.env`에 `XAI_API_KEY`가 설정되어 있고, 실제 서버에서 xAI API 접근이 가능하면 Grok 응답이 정상 작동합니다.
- 필요한 키/옵션은 `server/.env.example`를 참고하세요. (키 값은 절대 커밋하지 마세요)

# 技术栈

该项目使用以下技术栈
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


# 开发流程

1. 参考用户需求，调整 src/index.css 与 tailwind.config.ts 的主题风格
2. 根据用户需求，划分出所需要实现的页面
3. 整理好每个页面需要实现的功能，在 pages 下创建对应的文件夹及其下入口 Index.tsx
4. 在 App.tsx 中创建路由配置，引入刚才的各个入口文件 Index.tsx
5. 根据刚才整理的需求，如果需求简单，可以直接在 Index.tsx 中完成该页面的全部工作
6. 如果需求复杂，可以将 page 拆分为若干个组件来实现，目录结构如下：
    - Index.tsx 入口
    - /components/ 组件
    - /hooks/ 钩子
    - /stores/ 如果有复杂交互通信时，可以使用 zustand 进行通信
7. 在完成需求后，需要进行 pnpm i 安装依赖，并使用 npm run lint & npx tsc --noEmit -p tsconfig.app.json --strict 进行检查，并修复问题

# 接入后端接口
- 当需要新增接口或者操作 supabase 时，需要先在 src/api 新增对应 api 文件，并导出对应的数据类型，可以参考 src/demo.ts 文件，如果是 supabase 还需要做好实现
- 前端与 supabase 做实现时，都需要完全按照数据类型进行实现，尽可能避免修改定好的数据类型，如果出现修改，需要检查所有引用该类型的文件
