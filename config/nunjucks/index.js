const nunjucks = require('nunjucks')
const njkMarkdown = require('nunjucks-markdown')
const md = require('markdown-it')({
  html: true,
  typographer: true,
  breaks: true,
  linkify: true,
})

const templateGlobals = require('./globals')
const filters = require('./filters')

module.exports = (app, config) => {
  const env = nunjucks.configure([`${config.root}/src/app/views`], {
    autoescape: true,
    express: app,
    watch: config.isDev,
    noCache: !config.views.cache,
  })

  // Custom filters
  Object.keys(filters).forEach((filter) => {
    env.addFilter(filter, filters[filter])
  })

  // Global variables
  Object.keys(templateGlobals).forEach((global) => {
    env.addGlobal(global, templateGlobals[global])
  })

  // Add markdown support
  njkMarkdown.register(env, (body) => {
    return md.render(body)
  })

  return env
}
