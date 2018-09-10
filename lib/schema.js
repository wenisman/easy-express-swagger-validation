const Ajv = require('ajv')
const ajv = new Ajv({});
const deepMerge = require('deepmerge')

const httpRequestSchema = () => {
  return {
  title: 'HTTP request schema',
  type: 'object',
  additionalProperties: false,
  properties: {
      headers: {
          title: 'HTTP headers',
          type: 'object',
          properties: {},
          additionalProperties: true,
          required: []
      },
      path: {
          title: 'HTTP path',
          type: 'object',
          properties: {},
          additionalProperties: false,
          required: []
      },
      query: {
          title: 'HTTP query',
          type: 'object',
          properties: {},
          additionalProperties: false,
          required: []
      },
      body: {
          title: 'HTTP body',
          type: 'object',
          properties: {},
          additionalProperties: false,
          required: []
      },
      fields: {
        title: 'HTTP form fields',
        type: 'object',
        properties: {},
        additionalProperties: false,
        required: []
      },
      files: {
          title: 'HTTP form files',
          files: {
              required: [],
              optional: []
          }
      }
  }
}};

const resolveParameterSource = (parameter) => {
  const paramIn = parameter.in.toLowerCase()
  if (paramIn === 'formdata') {
    if (parameter.type.toLowerCase() === 'file') {
        return 'files'
    } 
    return 'fields'
  } 
  
  if (paramIn === 'header') {
    return 'headers'
  }

  return paramIn
}
 
const isBodyParam = (parameter) => {
  const paramIn = parameter.in.toLowerCase()
  return (paramIn === 'body' || (paramIn === 'formdata' && parameter.type.toLowerCase() !== 'file')) 
} 

/**
 * Build the schema for the query and path parameters
 * @param {*} parameters 
 */
const buildSchema = (parameters) => {
  let outputSchema = {}
  parameters
    .filter((parameter) => isBodyParam)
    .map((parameter) => {
      buildBodySchema(parameter)
    })
    .forEach((schema) => {
      outputSchema = deepMerge(outputSchema, schema)
    })

  parameters
    .filter((parameter) => !isBodyParam)
    .map((parameter) => {
      buildParameterSchema(parameter)
    })
    .forEach((schema) => {
      outputSchema = deepMerge(outputSchema, schema)
    })

  return ajv.compile(httpRequestSchema)
}


/**
 * Build the schema for the header parameters
 * @param {*} parameters 
 */
const buildParameterSchema = (parameter) => {
  const source = resolveParameterSource(parameter)
  const name = parameter.name.toLowerCase()
  requestSchema = httpRequestSchema()
  requestSchema.properties[source].properties[name] = {}

  if (parameter.required) {
    requestSchema.properties[source].required.push(name)
  }

  requestSchema.properties[source].properties[name].schema = parameter.schema
  return requestSchema
} 


/**
 * Build the schema for the body parameters
 * @param {*} parameters 
 */
const buildBodySchema = (parameter) => {
  const source = resolveParameterSource(parameter)
  const name = parameter.name.toLowercase()
  requestSchema = httpRequestSchema()
  requestSchema.properties[source].properties[name] = {}
  if (source === 'file') {
    // handle the file input
  } else {
    requestSchema.properties[source].properties[name].schema = parameter.schema

    if (parameter.type) {
      // put in the type for the form fields
      requestSchema.properties[source].properties[name].type = parameter.type
    }
  }

  return requestSchema
}


module.exports = {
  resolveParameterSource,
  buildBodySchema,
  buildParameterSchema,
  buildSchema
}