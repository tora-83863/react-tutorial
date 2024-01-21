import axios from 'axios';

export interface RequestParameter {
  appid: string;
  lat: string;
  lon: string;
}

interface ResposeParameter {
  data: {
    Feature: {
      Property: {
        AddressElement: AddressElement[];
      };
    }[];
  };
}

type AddressElement = { Level: string; Code: string; Name: string };

/**
 * Yahoo!リバースジオコーダAPI
 * https://developer.yahoo.co.jp/webapi/map/openlocalplatform/v1/reversegeocoder.html
 */
export const reverseGeocoder = async (requestParameter: RequestParameter) => {
  const params = {
    ...requestParameter,
    output: "json",
  };
  const BASE_URL = "https://map.yahooapis.jp/geoapi/V1/reverseGeoCoder?";

  const jsonpAdapter = require("axios-jsonp");

  const result = { code: "", address: "", existError: false };
  try {
    const res: ResposeParameter = await axios.get(
      BASE_URL + new URLSearchParams(params).toString(),
      { adapter: jsonpAdapter }
    );
    if (res.data.Feature === null || res.data.Feature === undefined) {
      return result;
    }
    const addressElements = res.data.Feature[0].Property.AddressElement;
    for (let i = 0; i < addressElements?.length; i++) {
      result.address = result.address + addressElements[i].Name;
      if (addressElements[i].Level === "prefecture") {
        result.code = addressElements[i].Code;
      }
    }
  } catch (error) {
    result.existError = true;
  } finally {
    return result;
  }
};
