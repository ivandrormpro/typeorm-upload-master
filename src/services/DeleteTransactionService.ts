import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { isUuid } = require('uuidv4');

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!isUuid(id)) {
      throw new AppError('Transactions id not valid');
    }

    const transaction = await transactionsRepository.findOne({
      id,
    });

    if (!transaction) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.delete({ id: transaction.id });
  }
}

export default DeleteTransactionService;
