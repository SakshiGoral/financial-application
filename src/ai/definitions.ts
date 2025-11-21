import { z } from 'zod';

// Suggest Transaction Categories
export const SuggestTransactionCategoriesInputSchema = z.object({
  description: z.string().optional().describe('The description of the transaction.'),
  pythonMode: z.boolean().optional().describe('If true, the output will include a Python list of categories.'),
});
export type SuggestTransactionCategoriesInput = z.infer<typeof SuggestTransactionCategoriesInputSchema>;

export const SuggestTransactionCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested categories for the transaction.'),
  pythonCategories: z.string().optional().describe('A Python list of the suggested categories as a string.'),
});
export type SuggestTransactionCategoriesOutput = z.infer<typeof SuggestTransactionCategoriesOutputSchema>;


// Provide Automated Budget Advice
const TransactionSchemaForAdvice = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  timestamp: z.number(),
  paymentMethod: z.string(),
});

const BudgetSchemaForAdvice = z.object({
  id: z.string(),
  category: z.string(),
  amount: z.number(),
});

export const ProvideAutomatedBudgetAdviceInputSchema = z.object({
  transactions: z.array(TransactionSchemaForAdvice).describe('A list of recent user transactions.'),
  budgets: z.array(BudgetSchemaForAdvice).describe('The user\'s current budgets.'),
});
export type ProvideAutomatedBudgetAdviceInput = z.infer<typeof ProvideAutomatedBudgetAdviceInputSchema>;

export const ProvideAutomatedBudgetAdviceOutputSchema = z.object({
  advice: z.string().describe('A short, actionable piece of financial advice for the user.'),
});
export type ProvideAutomatedBudgetAdviceOutput = z.infer<typeof ProvideAutomatedBudgetAdviceOutputSchema>;


// Answer Financial Questions
const TransactionSchemaForQuestions = z.object({
  id: z.string(),
  amount: z.number(),
  description: z.string(),
  category: z.string(),
  timestamp: z.number(),
  paymentMethod: z.string(),
});

const BudgetSchemaForQuestions = z.object({
  id: z.string(),
  category: z.string(),
  amount: z.number(),
});

const GoalSchemaForQuestions = z.object({
    id: z.string(),
    name: z.string(),
    targetAmount: z.number(),
    currentAmount: z.number(),
    deadline: z.string(),
});

export const AnswerFinancialQuestionsInputSchema = z.object({
  question: z.string().describe("The user's question about their financial situation."),
  transactions: z.array(TransactionSchemaForQuestions).describe('A list of user transactions.'),
  budgets: z.array(BudgetSchemaForQuestions).describe("The user's current budgets."),
  goals: z.array(GoalSchemaForQuestions).describe("The user's savings goals."),
});
export type AnswerFinancialQuestionsInput = z.infer<typeof AnswerFinancialQuestionsInputSchema>;

export const AnswerFinancialQuestionsOutputSchema = z.object({
  answer: z.string().describe('A helpful, conversational answer to the user\'s question.'),
});
export type AnswerFinancialQuestionsOutput = z.infer<typeof AnswerFinancialQuestionsOutputSchema>;
