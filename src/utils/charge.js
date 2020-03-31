export function charge(DateType, Number = 10) {
  if (DateType < Number) {
    return '0' + DateType;
  } else {
    return DateType;
  }
}