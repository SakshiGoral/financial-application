'use server';

import {
  answerFinancialQuestions as answerFinancialQuestionsFlow,
  AnswerFinancialQuestionsInput,
  AnswerFinancialQuestionsOutput,
} from '@/ai/flows/answer-financial-questions';
import {
  provideAutomatedBudgetAdvice as provideAutomatedBudgetAdviceFlow,
  ProvideAutomatedBudgetAdviceInput,
  ProvideAutomatedBudgetAdviceOutput,
} from '@/ai/flows/provide-automated-budget-advice';
import {
  suggestTransactionCategories as suggestTransactionCategoriesFlow,
  SuggestTransactionCategoriesInput,
  SuggestTransactionCategoriesOutput,
} from '@/ai/flows/suggest-transaction-categories';
import {
    textToSpeech as textToSpeechFlow,
} from '@/ai/flows/text-to-speech';

export async function answerFinancialQuestions(
  input: AnswerFinancialQuestionsInput
): Promise<AnswerFinancialQuestionsOutput> {
  // In a real app, you might add authentication/validation here
  return await answerFinancialQuestionsFlow(input);
}

export async function provideAutomatedBudgetAdvice(
  input: ProvideAutomatedBudgetAdviceInput
): Promise<ProvideAutomatedBudgetAdviceOutput> {
  return await provideAutomatedBudgetAdviceFlow(input);
}

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return await suggestTransactionCategoriesFlow(input);
}

export async function textToSpeech(text: string): Promise<{media: string}> {
    return await textToSpeechFlow(text);
}
