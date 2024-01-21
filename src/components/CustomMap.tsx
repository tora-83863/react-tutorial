import 'leaflet/dist/leaflet.css';

import axios from 'axios';
import { LatLngLiteral } from 'leaflet';
import { useEffect, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';

import { reverseGeocoder } from '../api/reverseGeocoder';

import type { GeoJsonObject } from "geojson";
interface Props {
  height?: string | number;
  width?: string | number;
  setTodofukenCode: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  zoom?: number;
  setZoom: (val: number) => void;
  latLng?: LatLngLiteral;
  setLatLng: (val: LatLngLiteral) => void;
  address?: string;
  setAddress: (val: string) => void;
  appid: string;
}

export default function CustomMap(
  props: Props = {
    height: "95%",
    width: "95%",
    setTodofukenCode: () => {},
    onClose: () => {},
    setZoom: () => {},
    setLatLng: () => {},
    setAddress: () => {},
    appid: "",
  }
) {
  /** 47都道府県のポリゴンデータ */
  const [geojson, setGeojson] = useState<GeoJsonObject>();

  /** 初期表示時のフック */
  useEffect(() => {
    getGeojson();
  }, []);

  /**
   * 47都道府県のポリゴンデータを読込
   * https://japonyol.net/editor/article/47-prefectures-geojson.html
   */
  const getGeojson = async () => {
    const prefectures = await axios.get("./geojson/prefectures.geojson");
    setGeojson(prefectures.data);
  };

  function MapEvent() {
    useMapEvents({
      async click(e) {
        // クリックした座標から都道府県を取得
        await reverseGeocoder({
          appid: props.appid,
          lat: String(e.latlng.lat),
          lon: String(e.latlng.lng),
        }).then((result) => {
          if (result.existError) {
            props.onClose();
          } else if (result.code !== "") {
            // 都道府県を取得できた場合
            props.setTodofukenCode(result.code + "000");
            props.setZoom(e.target.getZoom());
            props.setLatLng(e.latlng);
            props.setAddress(result.address);
            props.onClose();
          }
        });
      },
    });
    return <></>;
  }

  return (
    <>
      <MapContainer
        center={props.latLng}
        zoom={props.zoom}
        style={{ height: props.height, width: props.width }}
        doubleClickZoom={false}
      >
        <TileLayer
          attribution='&amp;copy <a href="https://maps.gsi.go.jp/development/ichiran.html">地理院タイル</a> contributors'
          url="https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png"
        />
        <MapEvent />
        {/* 都道府県の境界線を設定 */}
        {geojson ? <GeoJSON data={geojson} style={{ weight: 1 }} /> : <></>}
      </MapContainer>
      {props.address ? <span>前回選択した地点：{props.address}</span> : <></>}
    </>
  );
}
