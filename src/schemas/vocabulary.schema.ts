import { z } from "zod";

const wordDefinitionSchema = z.object({
  partOfSpeech: z.string().min(1, "Part of speech không được để trống"),
  definitionEn: z.string().min(1, "Định nghĩa tiếng Anh không được để trống"),
  definitionVi: z.string().min(1, "Định nghĩa tiếng Việt không được để trống"),
  exampleEn: z.string().optional(),
  exampleVi: z.string().optional(),
  tips: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const addWordSchema = z.object({
  term: z.string().trim().min(1, "Term không được để trống"),
  phonetic: z.string().optional(),
  audioUrl: z.url().optional().or(z.literal("")),
  topic: z.string().min(1, "Topic không được để trống"),
  level: z.number().int().min(1).max(3).default(1),
  wordForm: z.string().optional(),
  definitions: z.array(wordDefinitionSchema).min(1, "Cần ít nhất 1 định nghĩa"),
  wordSetIds: z.array(z.string()),
});

export const addBulkWordsSchema = z.object({
  words: z.array(addWordSchema).min(1).max(500),
  wordSetId: z.string().optional(),
});

export const updateWordSetSchema = z.object({
  wordSetId: z.string().min(1, "Vui lòng cung cấp word set id"),
  name: z.string().optional(),
  level: z.string().optional(),
  description: z.string().optional(),
});

export type AddWordDto = z.infer<typeof addWordSchema>;
export type AddBulkWordsDto = z.infer<typeof addBulkWordsSchema>;
export type UpdateWordSetDto = z.infer<typeof updateWordSetSchema>;
