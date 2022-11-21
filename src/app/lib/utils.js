const { differenceInMonths, format, isValid, parseISO } = require('date-fns')

const parseDate = (date) => parseISO(date)

const formatDate = (date, dateFormat) => {
    if (!date) {
        return date
    }
    
    const parsedDate = parseDate(date)
    
    if (!isValid(parsedDate)) { return date }
    
    return format(parsedDate, dateFormat)
}

const getDifferenceInMonths = (date) => {
    const parsedDate = parseDate(date)
    const difference = differenceInMonths(parsedDate, new Date()) + 1
    return Math.abs(difference) === 1 ? 'in a month' : 'in ' + difference + ' months'
}

module.exports = {
    parseDate,
    formatDate,
    getDifferenceInMonths
}
