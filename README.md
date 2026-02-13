# Researcher

پیاده‌سازی مرحله‌ای سامانه خلاصه‌سازی و نمایه‌برداری فیش‌های متنی.

## فاز ۱ (Foundation)
- اسکلت Nuxt 3 با TypeScript
- TailwindCSS
- ESLint بر اساس `@antfu/eslint-config`
- مدل اولیه SQLite با Drizzle
- معماری Clean (`domain` / `application` / `infrastructure` / `presentation`)
- API اولیه پروژه‌ها

## فاز ۲ (Auth) — انجام شد
- ثبت‌نام با Email/Password: `POST /api/auth/register`
- ورود با Email/Password: `POST /api/auth/login`
- Session token مبتنی بر Bearer (`Authorization: Bearer <token>`)
- ایمن‌سازی API پروژه‌ها با session middleware
- افزودن جداول `sessions` و `oauth_accounts` در اسکیمای SQLite
- مسیر Google OAuth به‌صورت placeholder برای اتصال provider واقعی در فاز ۲.۱

## فازهای بعدی
1. Source TXT ingestion + parsing
2. Regex search + dedup + highlight
3. Index tree + mapping to notes
4. Summarize/Clone/Merge/Delete
5. Tree-view ordering + HTML export

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
