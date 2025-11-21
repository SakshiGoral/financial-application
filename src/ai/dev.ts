'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-transaction-categories.ts';
import '@/ai/flows/provide-automated-budget-advice.ts';
import '@/ai/flows/answer-financial-questions.ts';
