const nunjucks = require('nunjucks')
const { assign, isFunction, isArray } = require('lodash')

module.exports = {
  siteTitle: 'Department for International Trade',
  serviceTitle: 'Overseas Market Introduction Service',
  description: '',
  feedbackLink: '/support',

  // Renders macro with object passed as props
  // { macroName: 'TextField', type: 'textarea', modifier: 'small' }
  renderAsMacro (config, additionalProps) {
    function renderMacro (props = {}) {
      const macroName = props.macroName
      if (!macroName) { return }
      const macro = this.env.globals.callAsMacro.call(this, macroName)
      if (!isFunction(macro)) {
        throw Error(`${macroName} macro not found`)
      }
      return macro(assign({}, props, additionalProps))
    }

    if (isArray(config)) {
      const macroOutputs = config.map(renderMacro.bind(this))
      return new nunjucks.runtime.SafeString(macroOutputs.join('\r'))
    }

    return renderMacro.call(this, config)
  },
}
