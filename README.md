# Researcher

پیاده‌سازی مرحله‌ای سامانه خلاصه‌سازی و نمایه‌برداری فیش‌های متنی.

## فاز ۱ (Foundation)
- اسکلت Nuxt 3 با TypeScript
- TailwindCSS
- ESLint بر اساس `@antfu/eslint-config`
- مدل اولیه SQLite با Drizzle
- معماری Clean (`domain` / `application` / `infrastructure` / `presentation`)
- API اولیه پروژه‌ها

## فاز ۲ (Auth)
- ثبت‌نام با Email/Password: `POST /api/auth/register`
- ورود با Email/Password: `POST /api/auth/login`
- Session token مبتنی بر Bearer (`Authorization: Bearer <token>`)
- ایمن‌سازی API پروژه‌ها با session middleware
- افزودن جداول `sessions` و `oauth_accounts` در اسکیمای SQLite

## فاز ۳ (Source ingestion) — انجام شد
- ثبت/تعویض منبع فعال کاربر: `POST /api/sources/active`
- دریافت منبع فعال کاربر: `GET /api/sources/active`
- پارس خط‌به‌خط فایل TXT با فرمت `text<TAB>address`
- ذخیره منبع در `sources` و ردیف‌ها در `source_notes`
- غیرفعال‌سازی خودکار منبع قبلی کاربر هنگام ورود منبع جدید

## فازهای بعدی
1. Regex search + dedup + highlight
2. Index tree + mapping to notes
3. Summarize/Clone/Merge/Delete
4. Tree-view ordering + HTML export

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
