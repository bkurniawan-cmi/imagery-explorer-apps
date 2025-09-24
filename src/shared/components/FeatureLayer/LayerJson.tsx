import React, { useEffect } from 'react';
import MapView from '@arcgis/core/views/MapView';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import LayerView from '@arcgis/core/views/layers/LayerView';

type Props = {
    mapView?: MapView;
};

const CustomLayers: React.FC<Props> = ({ mapView }) => {
    useEffect(() => {
        if (!mapView) return;

        mapView.when(() => {
            const iupLayer = new GeoJSONLayer({
                url: '/data/all_iup.json',
                title: 'IUP Bauxite',
                renderer: {
                    type: 'simple',
                    symbol: {
                        type: 'simple-fill',
                        color: 'rgba(255, 99, 71, 0)',
                        outline: {
                            color: 'yellow',
                            width: 1,
                        },
                    },
                },
                outFields: ['*'],
            });

            mapView.map.add(iupLayer);

            mapView
                .whenLayerView(iupLayer)
                .then((lv: LayerView) =>
                    console.log('IUP LayerView loaded:', lv)
                )
                .catch((err) => console.error('IUP error:', err));
        });
    }, [mapView]);

    return null;
};

export default CustomLayers;
