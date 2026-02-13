# Researcher

پیاده‌سازی مرحله‌ای سامانه خلاصه‌سازی و نمایه‌برداری فیش‌های متنی.

## فاز ۱ (انجام شده)
- اسکلت Nuxt 3 با TypeScript
- TailwindCSS
- تنظیمات ESLint بر اساس `@antfu/eslint-config`
- مدل اولیه SQLite با Drizzle
- پایه معماری Clean:
  - `domain`
  - `application`
  - `infrastructure`
  - `presentation` (Nuxt API/UI)
- API اولیه پروژه‌ها:
  - `GET /api/projects`
  - `POST /api/projects`

## فازهای بعدی
1. Auth (Google + Email/Password)
2. Source TXT ingestion + parsing
3. Regex search + dedup + highlight
4. Index tree + mapping to notes
5. Summarize/Clone/Merge/Delete
6. Tree-view ordering + HTML export

## توسعه محلی
```bash
pnpm install
pnpm dev
```

## دیتابیس
```bash
pnpm db:generate
pnpm db:migrate
```
