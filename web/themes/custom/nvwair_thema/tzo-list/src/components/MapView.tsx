import * as React from 'react';
import { List } from 'immutable';
import { TZOList, VerdictList } from '../types'

const L = window.L;

interface IFeatureCollection {
  type: string;
  features: any;
}

function getGeoJSON(data: TZOList, filteredData: List<string>): IFeatureCollection {
  return {
    "type": "FeatureCollection",
    "features": filteredData.map((nid: string) => {
        const tzo = data.get(nid);
        return {
          "type": "Feature",
          "id": tzo.nid,
          "properties": {
            "title": tzo.title,
            "url": tzo.url,
            "verdict": tzo.verdict,
            "address": {
              "street": tzo.address.street,
              "city": tzo.address.city,
              "zip": tzo.address.zip
            }
          },
          "geometry": {
            "type": "Point",
            "coordinates": [tzo.geom.lng, tzo.geom.lat]
          }
        }
      }).toJS()
    };
}

function createPopup(verdicts: VerdictList) {
  return (feature: any, layer: any) => {
    let verdict = verdicts.get(feature.properties.verdict);
    layer.bindPopup(`<a href="${feature.properties.url}" title="${feature.properties.title}">${feature.properties.title}</a><br />
      ${(typeof verdict !== "undefined") ? `<span class="${verdict.color}">${verdict.name}</span><br >` : ''}
      ${feature.properties.address.street}<br />
      ${feature.properties.address.zip} ${feature.properties.address.city}<br />
    `);
  }
}

export interface Props {
  data: TZOList;
  filteredData: List<string>;
  verdicts: VerdictList;
}

class MapView extends React.Component<Props> {
  map: any;
  markers: any;

  componentDidMount() {
    const { data, filteredData, verdicts } = this.props;

    if (!filteredData.count()) {
      return;
    }

    const geoJsonData = getGeoJSON(data, filteredData)

    const tiles = L.tileLayer('//geodata.nationaalgeoregister.nl/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=brtachtergrondkaart&TILEMATRIXSET=EPSG:28992&TILEMATRIX=EPSG:28992:{z}&TILEROW={y}&TILECOL={x}&FORMAT=image/png', {
      minZoom: 3,
      maxZoom: 12,
      attribution: '&copy; <a href="https://www.pdok.nl/copyright">Publieke Dienstverlening Op de Kaart (PDOK)</a> contributors'
    });
    this.map = L.map('leaflet-map', {crs: L.CRS.RD})
        .addLayer(tiles);

    this.markers = L.markerClusterGroup();
    const geoJsonLayer = L.geoJson(geoJsonData, {
      onEachFeature: createPopup(verdicts)
    });

    this.markers.addLayer(geoJsonLayer);
    this.map.addLayer(this.markers);
    this.map.fitBounds(this.markers.getBounds());
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.filteredData === this.props.filteredData) {
      return;
    }
    const { data, filteredData, verdicts } = this.props;

    if (!filteredData.count()) {
      return;
    }

    const geoJsonData = getGeoJSON(data, filteredData);
    this.markers.clearLayers();
    const geoJsonLayer = L.geoJson(geoJsonData, {
      onEachFeature: createPopup(verdicts)
    });
    this.markers.addLayer(geoJsonLayer);
    this.map.addLayer(this.markers);
  }

  componentWillUnmount() {
    this.map && this.map.remove();
  }

  render() {
    return (
      <div className="inspectiersultaten-leaflet open">
        <div id="leaflet-map" style={{minWidth: 150, height: 750}}></div>
      </div>
    );
  }
}

export default MapView;
