/**
 * groupBy an array using a getter function
 * @param {Array<V>} list - array data
 * @param {Function} keyGetter - getter function
 * @returns {Map<K, Array<V>>}
 */
export const groupBy = <K, V>(
  list: Array<V>,
  keyGetter: (input: V) => K,
): Map<K, Array<V>> => {
  const map = new Map<K, Array<V>>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

/**
 * converts a single-dimensional array to two-dimensional array
 * with a static length [1,2,3,4,5,6] => [[1,2,3], [4,5,6]]
 * @param {Array<string>} values - single dimensional array
 * @param {number} length - length of inner arrays
 * @returns {Array<Array<string>>}
 */
export const toMatrix = (values: string[], length: number): string[][] =>
  values.reduce<string[][]>(
    (rows: any, key: string, index: number) =>
      (index % length === 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    [],
  );