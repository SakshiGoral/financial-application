'use server';

import {
  suggestTransactionCategories as suggestTransactionCategoriesFlow,
  SuggestTransactionCategoriesInput,
  SuggestTransactionCategoriesOutput,
} from '@/ai/flows/suggest-transaction-categories';

export async function suggestTransactionCategories(
  input: SuggestTransactionCategoriesInput
): Promise<SuggestTransactionCategoriesOutput> {
  return await suggestTransactionCategoriesFlow(input);
}
