export function rae(v) {
  let _v = v;
  return [
    function set(a) {
      _v = a;
    },
    function get() {
      return _v;
    },
  ];
}
