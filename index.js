
module.exports = new List()
module.exports.List = List

function List() {
  this._arr = []
  this._obj = {}
}

List.prototype.add = function(key, value) {
  var info = { value: value, key: key, index: this._arr.length }
  this._obj[key] = info
  return this._arr.push(info)
}

List.prototype.has = function(key) {
  return !!this._obj[key]
}

List.prototype.get = function(key) {
  if (this._obj[key]) return this._obj[key].value
}

List.prototype.remove = function(key) {
  var info = this._obj[key]
  delete this._obj[key]
  this._arr.splice(info.index, 1)
  return info.value
}

List.prototype.rename = function(okey, nkey) {
  this._obj[nkey] = this._obj[okey]
  delete this._obj[okey]
}

; [ 'join'
  , 'toString'
  , 'indexOf'
  , 'lastIndexOf'
  , 'forEach'
  , 'every'
  , 'map'
  , 'some'
  , 'reduce'
  , 'reduceRight'
  ].forEach(function(name) {
    List.prototype[name] = function() {
      return this.toArray()[name].apply(this._arr, arguments)
    }
  })

List.prototype.toArray = function() {
  return this._arr.map(function(info) {
    return info.value
  })
}

List.prototype.values = List.prototype.toArray

List.prototype.keys = function() {
  return Object.keys(this._obj)
}

Object.defineProperty(List.prototype, 'length', { get: function() { return this._arr.length } })


List.prototype.first = function() {
  return this._arr[0].value
}
List.prototype.last = function() {
  return this._arr[this._arr.length-1].value
}

;['pop', 'shift'].forEach(function(name) {
  List.prototype[name] = function() {
    var info = this._arr[name]()
    delete this._obj[info.key]
    return info.value
  }
})

List.prototype._updateIndexes = function() {
  this._arr.forEach(function(info, index) {
    info.index = index
  })
}

List.prototype.reverse = function(fn) {
  this._arr.reverse()
  this._updateIndexes()
}

List.prototype.sort = function(fn) {
  this._arr.sort(function(a, b) {
    return fn(a.value, b.value)
  })
  this._updateIndexes()
}

List.prototype.filter = function(fn, context) {
  var list = new List()
  this._arr.forEach(function(info) {
    if (fn(info.value, context)) {
      list.add(info.key, info.value)
    }
  })
  return list
}

List.prototype.next = function(key) {
  var info = this._obj[key]
  if (!info) return null

  info = this._arr[ info.index + 1 ]
  if (!info) return null

  return info.value
}

List.prototype.previous = function(key) {
  var info = this._obj[key]
  if (!info) return null

  info = this._arr[ info.index - 1 ]
  if (!info) return null

  return info.value
}
