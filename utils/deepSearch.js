function deepSearch(obj, key) {
  function deepSearchByKey(object, originalKey, matches = []) {
    if (object !== null) {
      if (Array.isArray(object)) {
        for (let arrayItem of object) {
          deepSearchByKey(arrayItem, originalKey, matches);
        }
      } else if (typeof object == 'object') {
        for (let key of Object.keys(object)) {
          if (key == originalKey) {
            matches.push(object);
          } else {
            deepSearchByKey(object[key], originalKey, matches);
          }
        }
      }
    }
    return matches;
  }
  const result = deepSearchByKey(obj, key);

  return result.length === 0 ? [0] : result.map((el) => el[key]).reduce((acc, el) => acc + el);
}

module.exports = deepSearch;
