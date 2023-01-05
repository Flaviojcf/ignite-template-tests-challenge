import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { InMemoryStatementsRepository } from "./../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create a statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement", async () => {
    const newUser: ICreateUserDTO = {
      email: "teste@gmail.com",
      name: "UserTeste2",
      password: "123456",
    };

    const user = await createUserUseCase.execute({
      email: newUser.email,
      name: newUser.name,
      password: newUser.password,
    });

    const newStatement: ICreateStatementDTO = {
      amount: 100,
      description: "test",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    };
    const result = await createStatementUseCase.execute({
      amount: newStatement.amount,
      description: newStatement.description,
      type: newStatement.type,
      user_id: newStatement.user_id,
    });
    expect(result).toHaveProperty("id");
  });

  it("should not be able to create a statement with a nonexistent user", () => {
    expect(async () => {
      const newStatement: ICreateStatementDTO = {
        amount: 100,
        description: "test",
        type: OperationType.DEPOSIT,
        user_id: "123",
      };
      await createStatementUseCase.execute({
        amount: newStatement.amount,
        description: newStatement.description,
        type: newStatement.type,
        user_id: newStatement.user_id,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a statement if user doesn't has sufficient funds", () => {
    expect(async () => {
      const newUser: ICreateUserDTO = {
        email: "teste@gmail.com",
        name: "UserTeste2",
        password: "123456",
      };

      const user = await createUserUseCase.execute({
        email: newUser.email,
        name: newUser.name,
        password: newUser.password,
      });

      const newStatementWithdraw: ICreateStatementDTO = {
        amount: 150,
        description: "test",
        type: OperationType.WITHDRAW,
        user_id: String(user.id),
      };

      await createStatementUseCase.execute({
        amount: newStatementWithdraw.amount,
        description: newStatementWithdraw.description,
        type: newStatementWithdraw.type,
        user_id: newStatementWithdraw.user_id,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
