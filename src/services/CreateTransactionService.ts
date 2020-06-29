import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryRepository = getRepository(Category);

    let selectedCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!selectedCategory) {
      selectedCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(selectedCategory);
    }

    if (
      (await transactionsRepository.getBalance()).total - value < 0 &&
      type === 'outcome'
    ) {
      throw new AppError('Not enough balance for outcome transaction');
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category_id: selectedCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
