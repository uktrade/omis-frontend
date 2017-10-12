const moment = require('moment')
const dateFns = require('date-fns')
const Case = require('case')
const {
  assign,
  flatten,
  isArray,
  isPlainObject,
  isEmpty,
  isString,
  pickBy,
  isNil,
} = require('lodash')

const { formats } = require('../../config')

function isNotEmpty (value) {
  return !isNil(value) && !/^\s*$/.test(value) && !(isPlainObject(value) && isEmpty(value))
}

const filters = {
  assign,
  sentenceCase: Case.sentence,

  // TODO: Temporary to allow importing of data hub macros
  highlight: (string) => {
    return string
  },

  formatDate: (value, format = formats.dateLong) => {
    if (!value) {
      return value
    }
    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }
    return dateFns.format(parsedDate, format)
  },

  formatDateTime: (value, format = formats.dateTimeMedium) => {
    if (!value) {
      return value
    }

    const parsedDate = dateFns.parse(value)

    if (!dateFns.isValid(parsedDate)) { return value }

    return dateFns.format(parsedDate, format)
  },

  fromNow: (value) => {
    return moment(value).fromNow()
  },

  removeNilAndEmpty: (collection) => {
    if (isArray(collection)) {
      return collection.filter(isNotEmpty)
    }
    if (isPlainObject(collection)) {
      return pickBy(collection, isNotEmpty)
    }
    return collection
  },

  applyClassModifiers (className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) { return className }

    const classModifier = flatten([modifier]).map(mod => `${className}--${mod}`).join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
