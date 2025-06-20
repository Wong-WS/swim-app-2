import React from 'react';
import styled from 'styled-components';
import Select from '../common/Select';
import { useApp } from '../../contexts/AppContext';

const SelectorContainer = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const PlaceSelector = ({ selectedPlace, onPlaceChange }) => {
  const { places } = useApp();

  // Group places by area
  const placesByArea = places.reduce((acc, place) => {
    if (!acc[place.area]) {
      acc[place.area] = [];
    }
    acc[place.area].push(place);
    return acc;
  }, {});

  // Create options for the select component
  const placeOptions = Object.keys(placesByArea).flatMap(area => {
    const areaLabel = `--- ${area} ---`;
    const areaOption = { value: '', label: areaLabel, disabled: true };
    
    const placeOptions = placesByArea[area].map(place => ({
      value: place.id,
      label: place.name
    }));
    
    return [areaOption, ...placeOptions];
  });

  return (
    <SelectorContainer>
      <Title>Select a Location</Title>
      <Select
        label="Place"
        value={selectedPlace}
        onChange={(e) => onPlaceChange(e.target.value)}
        options={placeOptions}
      />
    </SelectorContainer>
  );
};

export default PlaceSelector;
