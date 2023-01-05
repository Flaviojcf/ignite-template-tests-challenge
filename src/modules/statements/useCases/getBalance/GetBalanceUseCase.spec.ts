import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get a user balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get a user balance", async () => {
    const newUser: ICreateUserDTO = {
      email: "teste@gmail.com",
      name: "UserTeste2",
      password: "123456",
    };
    const user = await inMemoryUsersRepository.create(newUser);

    const newStatement: ICreateStatementDTO = {
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    };
    await inMemoryStatementsRepository.create(newStatement);

    const result = await getBalanceUseCase.execute({
      user_id: String(user.id),
    });
    expect(result.balance).toBeGreaterThanOrEqual(0);
  });

  it("should not be able to get a nonexistent user balance", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "invalidID",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
