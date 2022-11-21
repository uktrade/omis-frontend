const { differenceInMonths, format, isValid, parseISO } = require('date-fns')

const parseDate = (date) => parseISO(date)

const formatDate = (date, dateFormat) => {
    if (!date) {
        return date
    }
    
    const parsedDate = parseDate(date)
    const dateToUse = !isValid(parsedDate) ? date : parsedDate
    return format(dateToUse, dateFormat)
}

const getDifferenceInMonths = (date) => {
    const parsedDate = parseDate(date)
    const dateToUse = !isValid(parsedDate) ? date : parsedDate
    const difference = differenceInMonths(dateToUse, new Date())
    const verifiedDifference = difference === 0 ? 1 : difference
    return Math.abs(verifiedDifference) === 1 ? 'in a month' : 'in ' + difference + ' months'
}

module.exports = {
    parseDate,
    formatDate,
    getDifferenceInMonths
}
