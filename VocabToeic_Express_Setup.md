# VocabToeic — ExpressJS + Prisma + TypeScript

## Stack

| Lớp | Công nghệ |
|---|---|
| Runtime | Node.js 20 LTS |
| Framework | Express.js + TypeScript |
| ORM | Prisma + PostgreSQL |
| Cache / Blacklist | Redis (ioredis) |
| Auth | JWT Access (5m) + Refresh Token rotation (7d) |
| Background Jobs | node-cron + BullMQ |
| AI | @anthropic-ai/sdk |
| Validation | zod |
| Logging | pino |

---

## 1. Cấu trúc thư mục

```
vocabtoeic-api/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── server.ts                  # Express app factory
│   ├── index.ts                   # Entry point (listen)
│   │
│   ├── config/
│   │   └── index.ts               # Load & validate env vars
│   │
│   ├── lib/
│   │   ├── prisma.ts              # PrismaClient singleton
│   │   ├── redis.ts               # Redis singleton
│   │   └── logger.ts              # Pino logger
│   │
│   ├── middlewares/
│   │   ├── authenticate.ts        # Verify JWT Access Token
│   │   ├── error-handler.ts       # Global error handler
│   │   ├── rate-limiter.ts        # express-rate-limit
│   │   └── validate.ts            # Zod request validation
│   │
│   ├── modules/
│   │   ├── auth/                  # UC-01 ~ UC-04
│   │   │   ├── auth.router.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── token.service.ts   # JWT + Refresh Token
│   │   │   └── auth.schema.ts     # Zod schemas
│   │   │
│   │   ├── vocabulary/            # UC-05 ~ UC-08
│   │   │   ├── vocabulary.router.ts
│   │   │   ├── vocabulary.controller.ts
│   │   │   ├── vocabulary.service.ts
│   │   │   ├── srs.service.ts     # SM-2 algorithm
│   │   │   └── vocabulary.schema.ts
│   │   │
│   │   ├── exercise/              # UC-09 ~ UC-11
│   │   │   ├── exercise.router.ts
│   │   │   ├── exercise.controller.ts
│   │   │   ├── exercise.service.ts
│   │   │   ├── ai-generator.service.ts
│   │   │   └── exercise.schema.ts
│   │   │
│   │   ├── dashboard/             # UC-12 ~ UC-13
│   │   │   ├── dashboard.router.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── dashboard.service.ts
│   │   │
│   │   └── jobs/                  # UC-14
│   │       ├── enrich.processor.ts
│   │       └── enrich.scheduler.ts
│   │
│   └── types/
│       ├── express.d.ts           # Extend Request: req.user
│       └── common.ts              # Shared types
│
├── test/
├── .env.example
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

---

## 2. Khởi tạo từng bước

### Bước 1 — Tạo project

```bash
mkdir vocabtoeic-api && cd vocabtoeic-api
npm init -y
```

### Bước 2 — Cài dependencies

```bash
# Core Express
npm install express
npm install cors helmet
npm install cookie-parser
npm install express-rate-limit

# Auth
npm install jsonwebtoken bcrypt

# Prisma + Redis
npm install @prisma/client
npm install ioredis

# Validation
npm install zod

# AI + HTTP
npm install @anthropic-ai/sdk
npm install axios

# Background jobs
npm install bullmq node-cron

# Logging
npm install pino pino-pretty

# TypeScript dev
npm install -D typescript ts-node ts-node-dev
npm install -D @types/express @types/node @types/cors
npm install -D @types/cookie-parser @types/jsonwebtoken @types/bcrypt
npm install -D prisma
```

### Bước 3 — tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*", "prisma/seed.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### Bước 4 — package.json scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:generate": "npx prisma generate",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "npx prisma studio"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### Bước 5 — Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: vocabtoeic
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

```bash
docker compose up -d
```

### Bước 6 — .env

```env
# .env.example
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/vocabtoeic

JWT_SECRET=change-me-in-production
JWT_ACCESS_TTL=5m
JWT_REFRESH_DAYS=7

REDIS_HOST=localhost
REDIS_PORT=6379

ANTHROPIC_API_KEY=sk-ant-...
DICTIONARY_API_URL=https://api.dictionaryapi.dev/api/v2/entries/en
```

---

## 3. Code nền tảng

### src/config/index.ts

```typescript
import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET!,
    accessTtl: process.env.JWT_ACCESS_TTL || '5m',
    refreshDays: Number(process.env.JWT_REFRESH_DAYS) || 7,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY!,
  },
  dictionaryApiUrl: process.env.DICTIONARY_API_URL!,
};
```

### src/lib/prisma.ts

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### src/lib/redis.ts

```typescript
import Redis from 'ioredis';
import { config } from '@/config';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

redis.on('error', (err) => console.error('Redis error:', err));
```

### src/types/express.d.ts

```typescript
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id' | 'email'>;
    }
  }
}
```

### src/middlewares/authenticate.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import { redis } from '@/lib/redis';

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, config.jwt.secret) as {
      sub: string;
      email: string;
      jti: string;
    };

    // Kiểm tra JWT blacklist (UC-04 logout)
    const blacklisted = await redis.get(`blacklist:${payload.jti}`);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token revoked' });
    }

    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
```

### src/middlewares/validate.ts

```typescript
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
```

### src/middlewares/error-handler.ts

```typescript
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
}
```

### src/server.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authRouter } from '@/modules/auth/auth.router';
import { vocabularyRouter } from '@/modules/vocabulary/vocabulary.router';
import { exerciseRouter } from '@/modules/exercise/exercise.router';
import { dashboardRouter } from '@/modules/dashboard/dashboard.router';
import { errorHandler } from '@/middlewares/error-handler';

export function createApp() {
  const app = express();

  // Global middlewares
  app.use(helmet());
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Routes
  app.use('/api/auth', authRouter);
  app.use('/api/words', vocabularyRouter);
  app.use('/api/exercises', exerciseRouter);
  app.use('/api/dashboard', dashboardRouter);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  // Error handler — phải đặt cuối cùng
  app.use(errorHandler);

  return app;
}
```

### src/index.ts

```typescript
import { createApp } from './server';
import { config } from './config';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';
import { startEnrichScheduler } from './modules/jobs/enrich.scheduler';

async function bootstrap() {
  const app = createApp();

  await prisma.$connect();
  console.log('✓ Database connected');

  redis.ping().then(() => console.log('✓ Redis connected'));

  // Khởi động background job UC-14
  startEnrichScheduler();

  app.listen(config.port, () => {
    console.log(`✓ Server running on http://localhost:${config.port}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  });
}

bootstrap().catch(console.error);
```

---

## 4. Ví dụ module Auth (UC-01, UC-02)

### src/modules/auth/auth.schema.ts

```typescript
import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự'),
  confirmPassword: z.string(),
  displayName: z.string().min(2),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

### src/modules/auth/token.service.ts

```typescript
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '@/config';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export const tokenService = {
  signAccessToken(userId: string, email: string) {
    const jti = crypto.randomUUID();
    const token = jwt.sign(
      { sub: userId, email, jti },
      config.jwt.secret,
      { expiresIn: config.jwt.accessTtl },
    );
    return { token, jti };
  },

  async createRefreshToken(userId: string, deviceInfo?: string, ip?: string) {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + config.jwt.refreshDays);

    const record = await prisma.refreshToken.create({
      data: { userId, token, deviceInfo, ipAddress: ip, expiresAt },
    });
    return record;
  },

  async rotateRefreshToken(oldToken: string, deviceInfo?: string, ip?: string) {
    const record = await prisma.refreshToken.findUnique({
      where: { token: oldToken },
      include: { user: true },
    });

    if (!record) throw new Error('INVALID_TOKEN');
    if (!record.isActive) {
      // Token bị dùng lại — nghi ngờ tấn công, revoke tất cả
      await prisma.refreshToken.updateMany({
        where: { userId: record.userId },
        data: { isActive: false, revokedReason: 'Reuse detected' },
      });
      throw new Error('TOKEN_REUSE');
    }
    if (record.expiresAt < new Date()) throw new Error('TOKEN_EXPIRED');

    // Revoke token cũ
    await prisma.refreshToken.update({
      where: { id: record.id },
      data: { isActive: false, revokedAt: new Date(), revokedReason: 'Rotated' },
    });

    // Tạo token mới
    const newRefresh = await this.createRefreshToken(record.userId, deviceInfo, ip);
    const { token: accessToken } = this.signAccessToken(record.userId, record.user.email);

    return { accessToken, refreshToken: newRefresh.token, user: record.user };
  },

  async blacklistAccessToken(jti: string, ttlSeconds: number) {
    await redis.setex(`blacklist:${jti}`, ttlSeconds, '1');
  },
};
```

### src/modules/auth/auth.router.ts

```typescript
import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '@/middlewares/validate';
import { authenticate } from '@/middlewares/authenticate';
import { RegisterSchema, LoginSchema } from './auth.schema';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10,                   // UC-02: tối đa 10 lần / IP
  message: { message: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' },
});

export const authRouter = Router();

authRouter.post('/register', validate(RegisterSchema), authController.register);
authRouter.post('/login', loginLimiter, validate(LoginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
```

---

## 5. Prisma Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  displayName   String
  isActive      Boolean   @default(true)
  streak        Int       @default(0)
  lastStudyDate DateTime?
  createdAt     DateTime  @default(now())

  refreshTokens   RefreshToken[]
  wordProgresses  UserWordProgress[]
  exerciseResults ExerciseResult[]
  studySessions   StudySession[]
  @@map("users")
}

model RefreshToken {
  id            String    @id @default(uuid())
  userId        String
  token         String    @unique
  deviceInfo    String?
  ipAddress     String?
  isActive      Boolean   @default(true)
  expiresAt     DateTime
  revokedAt     DateTime?
  revokedReason String?
  createdAt     DateTime  @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("refresh_tokens")
}

model Word {
  id           String  @id @default(uuid())
  term         String  @unique
  phonetic     String?
  audioUrl     String?
  partOfSpeech String?
  topic        String
  level        Int

  definitions    WordDefinition[]
  userProgresses UserWordProgress[]
  @@map("words")
}

model WordDefinition {
  id           String  @id @default(uuid())
  wordId       String
  definitionEn String?
  definitionVi String?
  exampleEn    String?
  exampleVi    String?
  tips         String?
  isEnriched   Boolean @default(false)

  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)
  @@map("word_definitions")
}

model UserWordProgress {
  id             String     @id @default(uuid())
  userId         String
  wordId         String
  status         WordStatus @default(NEW)
  easeFactor     Float      @default(2.5)
  intervalDays   Int        @default(1)
  incorrectCount Int        @default(0)
  nextReviewAt   DateTime   @default(now())
  lastReviewedAt DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  word Word @relation(fields: [wordId], references: [id], onDelete: Cascade)

  @@unique([userId, wordId])
  @@map("user_word_progress")
}

enum WordStatus {
  NEW
  LEARNING
  REVIEW
  MASTERED
}

model Exercise {
  id            String   @id @default(uuid())
  part          Int
  topic         String
  difficulty    String
  content       Json
  isAiGenerated Boolean  @default(false)
  createdAt     DateTime @default(now())

  results ExerciseResult[]
  @@map("exercises")
}

model ExerciseResult {
  id          String   @id @default(uuid())
  userId      String
  exerciseId  String
  score       Float
  answers     Json
  timeTaken   Int
  completedAt DateTime @default(now())

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercise Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  @@map("exercise_results")
}

model StudySession {
  id            String   @id @default(uuid())
  userId        String
  studyDate     DateTime @db.Date
  wordsStudied  Int      @default(0)
  wordsReviewed Int      @default(0)
  createdAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([userId, studyDate])
  @@map("study_sessions")
}
```

---

## 6. Chạy dự án

```bash
# 1. Khởi động DB
docker compose up -d

# 2. Copy env
cp .env.example .env
# Điền ANTHROPIC_API_KEY vào .env

# 3. Prisma setup
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed

# 4. Chạy dev
npm run dev

# 5. Kiểm tra
curl http://localhost:3000/health
# → {"status":"ok"}
```

---

## 7. Thứ tự implement

| Tuần | Việc cần làm |
|---|---|
| Tuần 1 | Setup + Docker + Prisma schema + migrate + seed |
| Tuần 1 | Auth hoàn chỉnh: UC-01 ~ UC-04 (register, login, refresh, logout) |
| Tuần 2 | Vocabulary: UC-05 (list), UC-06 (flashcard), UC-07 (SRS/SM-2) |
| Tuần 2 | UC-08 (audio — xử lý ở frontend, backend chỉ trả audioUrl) |
| Tuần 3 | Exercise: UC-09 (AI generate), UC-10 (làm bài), UC-11 (submit) |
| Tuần 4 | Dashboard: UC-12 + UC-13 + Background job UC-14 |
