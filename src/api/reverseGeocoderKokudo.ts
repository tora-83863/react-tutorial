/**
 * 国土地理院の地理院地図の逆ジオコーディングAPI
 * https://github.com/gsi-cyberjapan/gsimaps/issues/29
 */

export interface RequestParameter {
  lat: string;
  lon: string;
}

export interface ResposeParameter {
  results: {
    lv01Nm: string;
    muniCd: string;
  };
}

export const reverseGeocoderKokudo = async (requestParameter: RequestParameter) => {
  const params = { ...requestParameter };
  const BASE_URL =
    "https://mreversegeocoder.gsi.go.jp/reverse-geocoder/LonLatToAddress?";
  const res = await fetch(BASE_URL + new URLSearchParams(params).toString());
  const json: ResposeParameter = await res.json();
  return {
    lv01Nm: json.results?.lv01Nm,
    muniCd: json.results?.muniCd,
  };
};
