const schema = require('./schema')
const Ajv = require('ajv')

describe('ajv schema creation', () => {

  it('should resolve parameter source', () => {
    let source = schema.resolveParameterSource({ in: 'query' })
    expect(source).toBe('query')

    source = schema.resolveParameterSource({ in: 'header' })
    expect(source).toBe('headers')

    source = schema.resolveParameterSource({ in: 'formData', type: 'file' })
    expect(source).toBe('files')

    source = schema.resolveParameterSource({ in: 'formData', type: 'fields' })
    expect(source).toBe('fields')

  })


  it('should build a parameter schema', () => {
    const parameter = { 
      in: 'query',
      name: 'queryParam',
      required: true,
      schema: { something: 'boo' }
    }
    const schema = schema.buildParameterSchema(parameter)

    console.log(schema)

    expect(schema).toBeDefined()
    expect(schema.properties.query).toEqual({
      title: 'HTTP query',
      type: 'object',
      properties: {
        queryparam: {
          schema: {
            something: 'boo'
          }
        }
      },
      additionalProperties: false,
      required: [
        'queryparam'
      ]
    })
  })
})

describe('ajv schema creation', () => {
  const parameter = { 
    in: 'query',
    name: 'queryParam',
    required: true,
    schema: { something: 'boo' }
  }
  const testSchema = schema.buildParameterSchema(parameter)
  let ajvValidator = null

  beforeEach(() => {
    ajvValidator = new Ajv()
  })

  it('should create a ajv schema', () => {
    const validator = ajvValidator.compile(testSchema)
    expect(validator).not.toBeUndefined()

    
  })
})