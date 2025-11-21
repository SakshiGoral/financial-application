'use server';

import {
  suggestTransactionCategories as suggestTransactionCategoriesFlow,
} from '@/ai/flows/suggest-transaction-categories';
import {
  provideAutomatedBudgetAdvice as provideAutomatedBudgetAdviceFlow,
} from '@/ai/flows/provide-automated-budget-advice';
import {
  answerFinancialQuestions as answerFinancialQuestionsFlow,
} from '@/ai/flows/answer-financial-questions';

import type {
  SuggestTransactionCategoriesInput,
  SuggestTransactionCategoriesOutput,
  ProvideAutomatedBudgetAdviceInput,
  ProvideAutomatedBudgetAdviceOutput,
  AnswerFinancialQuestionsInput,
  AnswerFinancialQuestionsOutput
} from '@/ai/definitions';

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return await suggestTransactionCategoriesFlow(input);
}

export async function provideAutomatedBudgetAdvice(
  input: ProvideAutomatedBudgetAdviceInput
): Promise<ProvideAutomatedBudgetAdviceOutput> {
  return await provideAutomatedBudgetAdviceFlow(input);
}

export async function answerFinancialQuestions(
  input: AnswerFinancialQuestionsInput
): Promise<AnswerFinancialQuestionsOutput> {
  return await answerFinancialQuestionsFlow(input);
}
