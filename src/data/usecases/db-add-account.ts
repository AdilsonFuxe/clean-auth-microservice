import { AccountModel } from '@src/domain/models';
import { AddAccount, AddAccountParams } from '@src/domain/usecases';
import {
  AddAccountRepository,
  Hasher,
  LoadAccountByEmailRepository,
} from '@src/data/protocols';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async add(params: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      params.email
    );
    if (account) {
      return null;
    }
    const hashedPassword = await this.hasher.hash(params.password);
    const result = await this.addAccountRepository.add({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: hashedPassword,
    });
    return result;
  }
}
