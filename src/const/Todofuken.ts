export type TodofukenType = Record<string, { code: string; name: string }>;

export const Todofuken: TodofukenType = {
  ZENKOKU: { code: "00000", name: "全国" },
  HOKKAIDO: { code: "01000", name: "北海道" },
  AOMORI: { code: "02000", name: "青森県" },
  IWATE: { code: "03000", name: "岩手県" },
  MIYAGI: { code: "04000", name: "宮城県" },
  AKITA: { code: "05000", name: "秋田県" },
  YAMAGATA: { code: "06000", name: "山形県" },
  FUKUSHIMA: { code: "07000", name: "福島県" },
  IBARAKI: { code: "08000", name: "茨城県" },
  TOCHIGI: { code: "09000", name: "栃木県" },
  GUNMA: { code: "10000", name: "群馬県" },
  SAITAMA: { code: "11000", name: "埼玉県" },
  CHIBA: { code: "12000", name: "千葉県" },
  TOKYO: { code: "13000", name: "東京都" },
  KANAGAWA: { code: "14000", name: "神奈川県" },
  NIIGATA: { code: "15000", name: "新潟県" },
  TOYAMA: { code: "16000", name: "富山県" },
  ISHIKAWA: { code: "17000", name: "石川県" },
  FUKUI: { code: "18000", name: "福井県" },
  YAMANASHI: { code: "19000", name: "山梨県" },
  NAGANO: { code: "20000", name: "長野県" },
  GIFU: { code: "21000", name: "岐阜県" },
  SHIZUOKA: { code: "22000", name: "静岡県" },
  AICHI: { code: "23000", name: "愛知県" },
  MIE: { code: "24000", name: "三重県" },
  SHIGA: { code: "25000", name: "滋賀県" },
  KYOTO: { code: "26000", name: "京都府" },
  OSAKA: { code: "27000", name: "大阪府" },
  HYOGO: { code: "28000", name: "兵庫県" },
  NARA: { code: "29000", name: "奈良県" },
  WAKAYAMA: { code: "30000", name: "和歌山県" },
  TOTTORI: { code: "31000", name: "鳥取県" },
  SHIMANE: { code: "32000", name: "島根県" },
  OKAYAMA: { code: "33000", name: "岡山県" },
  HIROSHIMA: { code: "34000", name: "広島県" },
  YAMAGUCHI: { code: "35000", name: "山口県" },
  TOKUSHIMA: { code: "36000", name: "徳島県" },
  KAGAWA: { code: "37000", name: "香川県" },
  EHIME: { code: "38000", name: "愛媛県" },
  KOCHI: { code: "39000", name: "高知県" },
  FUKUOKA: { code: "40000", name: "福岡県" },
  SAGA: { code: "41000", name: "佐賀県" },
  NAGASAKI: { code: "42000", name: "長崎県" },
  KUMAMOTO: { code: "43000", name: "熊本県" },
  OITA: { code: "44000", name: "大分県" },
  MIYAZAKI: { code: "45000", name: "宮崎県" },
  KAGOSHIMA: { code: "46000", name: "鹿児島県" },
  OKINAWA: { code: "47000", name: "沖縄県" },
};

export function getCode(key: keyof TodofukenType) {
  return Todofuken[key].code;
}

export function getName(key: keyof TodofukenType) {
  return Todofuken[key] === undefined ? "" : Todofuken[key].name;
}
