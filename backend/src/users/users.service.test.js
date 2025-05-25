import { UsersService } from './users.service';

describe('Users test', () => {
  const usersService = new UsersService();

  test('Get all users', async () => {
    const result = await usersService.findAll();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String)
        })
      ])
    )
  })
})