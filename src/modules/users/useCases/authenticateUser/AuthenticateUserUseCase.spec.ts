import { ICreateUserDTO } from "./../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AppError } from "../../../../shared/errors/AppError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate an user", async () => {
    const newUser: ICreateUserDTO = {
      email: "userTeste@gmail.com",
      name: "UserTeste",
      password: "1234",
    };
    await createUserUseCase.execute(newUser);
    const result = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password,
    });
    expect(result).toHaveProperty("token");
  });

  it("should not be able to authenticate a nonexixtent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "test@email.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate an user with incorrect password", async () => {
    expect(async () => {
      const newUser: ICreateUserDTO = {
        email: "userTeste@gmail.com",
        name: "UserTeste",
        password: "1234",
      };
      await createUserUseCase.execute(newUser);
      await authenticateUserUseCase.execute({
        email: newUser.email,
        password: "passwordWrong",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
