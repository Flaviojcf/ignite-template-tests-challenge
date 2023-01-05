import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show an user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to get an user profile", async () => {
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

    const result = await showUserProfileUseCase.execute(String(user.id));

    expect(result).toHaveProperty("email");
  });

  it("should be not able to get a nonexistent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalidID");
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
});
