const fmt = new Intl.NumberFormat("ja-JP", {
  notation: "standard",
});

/**
 * 数値を3桁カンマ区切りにする
 * @param number 数値
 * @return 3桁カンマ区切りされた数値
 */
export function numberFormat(number: number | undefined) {
  return number === undefined ? "" : fmt.format(BigInt(number));
}
