import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "./ICreateUserDTO";
import { CreateUserError } from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create a user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a new user", async () => {
    const newUser: ICreateUserDTO = {
      email: "teste@gmail.com",
      name: "UserTeste2",
      password: "123456",
    };

    const result = await createUserUseCase.execute(newUser);
    expect(result).toHaveProperty("id");
  });
  it("should not be able to create a new user with an existent email", () => {
    expect(async () => {
      const newUser: ICreateUserDTO = {
        email: "userTeste@gmail.com",
        name: "UserTeste",
        password: "1234",
      };

      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
