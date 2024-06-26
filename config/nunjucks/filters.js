const { formatDate, getDifferenceInMonths } = require('../../src/app/lib/utils')
const Case = require('case')
const numeral = require('numeral')
const {
  assign,
  concat,
  flatten,
  isArray,
  isPlainObject,
  isEmpty,
  isFunction,
  isString,
  pickBy,
  isNil,
} = require('lodash')
require('numeral/locales/en-gb')
numeral.locale('en-gb')

const { formats } = require('../../config')

function isNotEmpty(value) {
  return (
    !isNil(value) &&
    !/^\s*$/.test(value) &&
    !(isPlainObject(value) && isEmpty(value))
  )
}

function pluralise(string, count, pluralisedWord) {
  if (parseInt(count, 10) !== 1) {
    if (pluralisedWord) {
      string = pluralisedWord
    } else if (string.match(/[^aeiou]y$/)) {
      string = string.replace(/y$/, 'ies')
    } else {
      string += 's'
    }
  }

  return string
}

const filters = {
  assign,
  concat,
  pluralise,
  isFunction,
  sentenceCase: Case.sentence,

  // TODO: Temporary to allow importing of data hub macros
  highlight: (string) => {
    return string
  },

  formatCurrency: (value, format = formats.currency) => {
    return numeral(value).format(format)
  },

  formatDate: (value, format = formats.dateLong) => {
    return formatDate(value, format)
  },

  formatDateTime: (value, format = formats.dateTimeLong) => {
    return formatDate(value, format)
  },

  fromNow: (value) => {
    return getDifferenceInMonths(value)
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

  applyClassModifiers(className, modifier) {
    if (!isString(className) || !(isString(modifier) || isArray(modifier))) {
      return className
    }

    const classModifier = flatten([modifier])
      .map((mod) => `${className}--${mod}`)
      .join(' ')

    return `${className} ${classModifier}`.trim()
  },
}

module.exports = filters
