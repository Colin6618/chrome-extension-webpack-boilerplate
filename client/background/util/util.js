var format = function(url) {
  if(/http(s)?\:/.test(url))
    return url;
  else
    return 'http:' + url;
}

module.exports = {
  format: format
}
