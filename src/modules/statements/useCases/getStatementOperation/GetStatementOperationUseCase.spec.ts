import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get a statement operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get a statement operation", async () => {
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
    const statement = await inMemoryStatementsRepository.create(newStatement);

    const result = await getStatementOperationUseCase.execute({
      statement_id: String(statement.id),
      user_id: String(user.id),
    });
    expect(result).toHaveProperty("type");
  });

  it("should not be able to get a statement operation if user doesn't exists", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        statement_id: "invalidID",
        user_id: "invalidID",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get a statement operation if statement doesn't exists", () => {
    expect(async () => {
      const newUser: ICreateUserDTO = {
        email: "teste@gmail.com",
        name: "UserTeste2",
        password: "123456",
      };
      const user = await inMemoryUsersRepository.create(newUser);
      await getStatementOperationUseCase.execute({
        statement_id: "invalidID",
        user_id: String(user.id),
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
