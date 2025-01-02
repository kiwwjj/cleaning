import { OrdersService } from "./orders.service";

describe('Orders test', () => {
  const ordersService = new OrdersService();

  test('Get all orders', async () => {
    const result = await ordersService.findAll();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          user_id: expect.any(Number),
          order_date: expect.any(Date),
          status: expect.any(String)
        })
      ])
    )
  })
})