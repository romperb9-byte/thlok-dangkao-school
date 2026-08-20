# ប្រព័ន្ធគ្រប់គ្រងសាលាបឋមសិក្សាថ្លុកដង្កោ

កម្មវិធីគ្រប់គ្រងកម្រងសាលារៀន ៧ សាលា ដែលសរសេរដោយ React, TypeScript និង Vite។

## ដំណើរការក្នុងម៉ាស៊ីន

```bash
npm ci
npm run dev
```

បើក `http://localhost:5173`។

## Build

```bash
npm run build
```

## Deploy ទៅ GitHub Pages

1. បង្កើត GitHub repository ថ្មី។
2. Push project នេះទៅ branch `main`។
3. នៅក្នុង repository ចូល `Settings → Pages`។
4. កំណត់ `Source` ជា `GitHub Actions`។
5. Workflow `Deploy school demo to GitHub Pages` នឹង build និង publish ដោយស្វ័យប្រវត្តិ។

URL នឹងមានទម្រង់៖ `https://USERNAME.github.io/REPOSITORY/`

## សុវត្ថិភាព

GitHub Pages version នេះគឺសម្រាប់ demo ប៉ុណ្ណោះ។ ទិន្នន័យរក្សាទុកក្នុង browser localStorage និងមិនសមស្របសម្រាប់ទិន្នន័យសិស្សពិត។ សម្រាប់ production ត្រូវភ្ជាប់ database និង authentication លើ server ដូចជា Supabase។
