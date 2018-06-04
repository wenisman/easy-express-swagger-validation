const swaggerParser = require('swagger-parser')
const ajv = require('./ajv')

const parseParameters = async (method) => {
  const parameters = {}

  // build the ajv schema based on parameter type
  // in body
  parameters['body'] = ajv.buildBodyValidation(parameter)
  // in query
  // in path
  // in header

  return parameters
}

const parseMethods = async (path) => {
  const methods = {}

  for (const method in path) {
    methods[method] = parseParameters(method)
  }

  return methods
} 

const parsePaths = async (spec) => {
  const paths = {}
  for(const path in spec.paths) {
    const regex = path
      .replace(/{[\w\d]+}/ig, '[\w%\d_]+')
      .replace('/', '\/')

    paths[regex] = await parseMethods(spec.paths[path])
  }

  return paths
}

const init = async (path) => {
  const deferenced = await swaggerParser.dereference(path)
  const spec = await swaggerParser.parse(path)

  const schema = await parsePaths(dereferenced)

  return schema
} 


module.exports = {
  parsePaths,
  init
}