import '../App.css';

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import MapTwoToneIcon from '@mui/icons-material/MapTwoTone';
import { Box, Button, Container, CssBaseline, Dialog, DialogContent, FormControl, Grid, MenuItem, Paper, Select, Toolbar, Typography } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';

import { getStatsData } from '../api/getStatsData';
import CustomChart from '../components/CustomChart';
import CustomMap from '../components/CustomMap';
import CustomTable from '../components/CustomTable';
import { getCode, getName, Todofuken } from '../const/Todofuken';

type DisplayData = {
  year: number;
  total?: number;
  male?: number;
  female?: number;
};

/** 地図の初期ズームレベル */
const DEFAULT_ZOOM = 5;

/** 地図の初期表示位置 */
const DEFAULT_LATLNG = { lat: 38, lng: 138 };

/** ダイアログコンポーネントに設定するID */
const DIALOG_ELEMENT_ID = "dialogItem";

export default function App() {
  /** 表示対象の都道府県 */
  const [todofukenCode, setTodofukenCode] = useState(Todofuken.ZENKOKU.code);

  /** 政府統計データ取得APIレスポンス格納用 */
  const [apiResult, setApiResult] = useState<{
    title: string;
    result: unknown;
  }>();

  /** グラフ及び表に出力するデータ */
  const [dataList, setDataList] = useState<DisplayData[]>([]);

  /** グラフ及び表に出力するデータ */
  const [open, setOpen] = useState(false);

  /** 地図のズームレベル */
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  /** 地図の表示位置 */
  const [latLng, setLatLng] = useState(DEFAULT_LATLNG);

  /** 地図で選択した住所 */
  const [address, setAddress] = useState("");

  /** 初期表示時のフック */
  useEffect(() => {
    getData();
  }, []);

  /** 都道府県変更時のフック */
  useEffect(() => {
    if (apiResult) {
      changeDisplayData(todofukenCode);
    }
  }, [todofukenCode, apiResult]);

  // URLパラメータ取得
  const search = useLocation().search;
  const urlSearchParams = new URLSearchParams(search);

  /** 政府統計データ取得APIキー */
  const getStatsDataAppId: string =
    urlSearchParams.get("getStatsDataAppId") ?? "";

  /** YahooリバースジオコーダAPIキー */
  const reverseGeocoderAppId: string =
    urlSearchParams.get("reverseGeocoderAppId") ?? "";

  /** 政府統計データ取得 */
  async function getData() {
    const res = await getStatsData({ appId: getStatsDataAppId });
    if (res.result !== undefined && res.title !== undefined) {
      // 結果が取得できた場合のみセット
      setApiResult(res);
    }
  }

  /** 選択中の都道府県に応じて表示するデータを変更 */
  async function changeDisplayData(todofukenCode: string) {
    const total: { year: number; total: number }[] = [];
    const male: { year: number; male: number }[] = [];
    const female: { year: number; female: number }[] = [];
    (
      apiResult?.result as Array<{
        $: string;
        "@area": string;
        "@cat01": string;
        "@tab": string;
        "@time": string;
        "@unit": string;
      }>
    ).map((row) => {
      // 人口性比のデータは除外
      if ("1120" === row["@tab"]) return;

      if (todofukenCode === row["@area"]) {
        const year = Number(row["@time"]) / 1000000;
        const population = Number(row.$);
        const category = row["@cat01"];
        const CATEGORY = {
          TOTAL: "100", // 総数
          MALE: "110", // 男性
          FEMALE: "120", // 女性
        };
        if (CATEGORY.TOTAL === category) {
          total.push({ year: year, total: population });
        } else if (CATEGORY.MALE === category) {
          male.push({ year: year, male: population });
        } else if (CATEGORY.FEMALE === category) {
          female.push({ year: year, female: population });
        }
      }
    });

    // 年の降順でソート
    total.sort((val1, val2) => val2.year - val1.year);

    // 行単位で年、総数、男性、女性のデータを保持するように編集
    const result: DisplayData[] = [];
    total.map((row) => result.push({ year: row.year, total: row.total }));
    for (let i = 0; i < result.length; i++) {
      male
        .filter((m) => m.year === result[i].year)
        .forEach((m) => (result[i].male = m.male));
      female
        .filter((f) => f.year === result[i].year)
        .forEach((f) => (result[i].female = f.female));
    }
    setDataList(result.slice());
    // setTableDataList(result.slice());
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MuiAppBar>
        <Toolbar sx={{ pr: "24px" }}>
          <Typography variant="h6">都道府県別人口推移</Typography>
        </Toolbar>
      </MuiAppBar>
      <Box sx={{ flexGrow: 1, height: "100vh", overflow: "auto" }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <Select
                  value={todofukenCode}
                  onChange={(e) => {
                    setTodofukenCode(e.target.value);
                    // 地図のズームレベル、表示位置を初期化
                    setZoom(DEFAULT_ZOOM);
                    setLatLng(DEFAULT_LATLNG);
                    setAddress("");
                  }}
                  variant="standard"
                >
                  {Object.keys(Todofuken).map((key: string, index) => (
                    <MenuItem value={getCode(key)} key={index}>
                      {getName(key)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                fullWidth={true}
              >
                地図から選択
                <MapTwoToneIcon fontSize="medium" sx={{ height: "100%" }} />
              </Button>
            </Grid>
            <Grid item sm={12} md={6}>
              <Paper sx={{ p: 2, height: 650 }}>
                <CustomChart
                  seriesList={[
                    { key: "total", name: "総数", stroke: "#2e8b57" },
                    { key: "male", name: "男性", stroke: "#6495ed" },
                    { key: "female", name: "女性", stroke: "#db7093" },
                  ]}
                  dataList={dataList}
                />
              </Paper>
            </Grid>
            <Grid item sm={12} md={6}>
              <Paper sx={{ p: 2, height: 650 }}>
                <CustomTable dataList={dataList.slice()} />
              </Paper>
            </Grid>
            <Dialog
              open={open}
              onClose={() => setOpen(true)}
              maxWidth="lg"
              onClick={(e) => {
                // モーダル外をクリックした場合、ダイアログを閉じる
                const target = e.target as HTMLObjectElement;
                if (target.closest(`#${DIALOG_ELEMENT_ID}`) === null) {
                  setOpen(false);
                }
              }}
            >
              <DialogContent sx={{ height: "800px" }} id={DIALOG_ELEMENT_ID}>
                <CustomMap
                  height="95%"
                  setTodofukenCode={setTodofukenCode}
                  onClose={() => setOpen(false)}
                  zoom={zoom}
                  setZoom={setZoom}
                  latLng={latLng}
                  setLatLng={setLatLng}
                  address={address}
                  setAddress={setAddress}
                  appid={reverseGeocoderAppId}
                />
              </DialogContent>
            </Dialog>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
