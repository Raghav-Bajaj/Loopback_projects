import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Customer,
  Account,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerAccountController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/account', {
    responses: {
      '200': {
        description: 'Customer has one Account',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Account>,
  ): Promise<Account> {
    return this.customerRepository.account(id).get(filter);
  }

  @post('/customers/{id}/account', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccountInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) account: Omit<Account, 'id'>,
  ): Promise<Account> {
    return this.customerRepository.account(id).create(account);
  }

  @patch('/customers/{id}/account', {
    responses: {
      '200': {
        description: 'Customer.Account PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Partial<Account>,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.customerRepository.account(id).patch(account, where);
  }

  @del('/customers/{id}/account', {
    responses: {
      '200': {
        description: 'Customer.Account DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.customerRepository.account(id).delete(where);
  }
}
