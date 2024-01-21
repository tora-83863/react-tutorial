export interface RequestParameter {
  appId?: string;
  lang?: string;
  dataSetId?: string;
  statsDataId?: string;
  startPosition?: string;
  limit?: string;
  metaGetFlg?: "Y" | "N";
  cntGetFlg?: "Y" | "N";
  explanationGetFlg?: "Y" | "N";
  annotationGetFlg?: "Y" | "N";
  replaceSpChars?: "0" | "1" | "2";
  callback?: string;
  sectionHeaderFlg?: "Y" | "N";
}

interface ResposeParameter {
  GET_STATS_DATA: {
    RESULT: {
      STATUS: number;
      ERROR_MSG: string;
      DATE: string;
    };
    PARAMETER: unknown;
    STATISTICAL_DATA: {
      RESULT_INF: unknown;
      TABLE_INF: {
        "@id": string;
        TITLE_SPEC: { TABLE_NAME: string };
      };
      CLASS_INF: unknown;
      DATA_INF: {
        NOTE: unknown;
        VALUE: unknown;
      };
    };
  };
}

/**
 * 政府統計の総合窓口（eStat）API 仕様【バージョン 3.0】
 * https://www.e-stat.go.jp/api/sites/default/files/uploads/2019/07/API-specVer3.0.pdf
 *
 * 統計表表示ID	00200521: 男女別人口及び人口性比 － 全国，都道府県（大正9年～令和2年）
 * https://www.e-stat.go.jp/index.php/stat-search/database?page=1&layout=dataset&toukei=00200521&tstat=000001011777&statdisp_id=0003410379
 */
export const getStatsData = async (
  options = {} as Partial<RequestParameter>
) => {
  const params = {
    statsDataId: "0003410379",
    metaGetFlg: "Y",
    cntGetFlg: "N",
    explanationGetFlg: "N",
    annotationGetFlg: "N",
    replaceSpChars: "1",
    sectionHeaderFlg: "N",
    ...options,
  };
  const BASE_URL = "https://api.e-stat.go.jp/rest/3.0/app/json/getStatsData?";
  const res = await fetch(BASE_URL + new URLSearchParams(params).toString());
  const json: ResposeParameter = await res.json();
  return {
    title:
      json.GET_STATS_DATA.STATISTICAL_DATA?.TABLE_INF?.TITLE_SPEC?.TABLE_NAME,
    result: json.GET_STATS_DATA.STATISTICAL_DATA?.DATA_INF?.VALUE,
  };
};
