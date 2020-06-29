import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import Transaction from '../models/Transaction';
import DeleteTransactionService from '../services/DeleteTransactionService';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface RTransaction {
  transactions: Transaction[];
  balance: Balance;
}

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const trans = await transactionsRepository.find();

  const balance = await transactionsRepository.getBalance();

  const rtTransactions: RTransaction = {
    transactions: trans,
    balance,
  };

  return response.json(rtTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, type, value, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  return response.status(204).send();
});

// transactionsRouter.post('/import', async (request, response) => {

// });

export default transactionsRouter;
