import React, { useEffect, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import MapView from '@arcgis/core/views/MapView';

type Props = {
    mapView?: MapView; // otomatis diisi oleh MapViewComponent
};

const LayerToggle: React.FC<Props> = ({ mapView }) => {
    const [layers, setLayers] = useState<(FeatureLayer | GeoJSONLayer)[]>([]);
    const [layerStates, setLayerStates] = useState<{ [key: string]: boolean }>(
        {}
    );

    useEffect(() => {
        if (!mapView) return;

        const updateLayers = () => {
            const allLayers = mapView.map.layers
                .filter(
                    (layer): layer is FeatureLayer | GeoJSONLayer =>
                        layer.type === 'feature' || layer.type === 'geojson'
                )
                .toArray();

            setLayers(allLayers);

            const initialStates: { [key: string]: boolean } = {};
            allLayers.forEach((layer) => {
                initialStates[layer.title] = layer.visible;
            });
            setLayerStates(initialStates);
        };

        updateLayers();

        const handle = mapView.map.layers.on('change', updateLayers);
        return () => {
            handle.remove();
        };
    }, [mapView]);

    const handleToggle = (layer: FeatureLayer | GeoJSONLayer) => {
        layer.visible = !layer.visible;
        setLayerStates((prev) => ({
            ...prev,
            [layer.title]: layer.visible,
        }));
    };

    if (!mapView) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: '60px',
                right: '15px',
                background: 'rgba(0, 35, 47)',
                color: 'rgba(191, 238, 254, var(--tw-text-opacity))',
                padding: '8px',
                borderRadius: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                maxHeight: '200px',
                overflowY: 'auto',
            }}
        >
            <strong>Layer</strong>
            {layers.map((layer) => (
                <div key={layer.id}>
                    <input
                        type="checkbox"
                        checked={layerStates[layer.title] || false}
                        onChange={() => handleToggle(layer)}
                    />
                    <label style={{ marginLeft: '6px' }}>{layer.title}</label>
                </div>
            ))}
        </div>
    );
};

export default LayerToggle;
