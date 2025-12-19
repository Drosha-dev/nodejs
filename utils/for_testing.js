const reverse = (string) => {
  return string.split('').reverse().join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  // if the array is empty, return 0 then run reducer
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse, average
}