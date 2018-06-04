const swagger = require('./swagger')
const path = require('path')

describe('swagger parsing', () => {
  it('should load the basic schema', () => {
    const filePath = path.join(__dirname, 'swagger.yaml')
    const schema = swagger.init(filePath)

    expect(schema).toBeDefined()
  })
})