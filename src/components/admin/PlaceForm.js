import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../common/Input';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';

const FormContainer = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const FormTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const PlaceForm = ({ editingPlace, onCancel }) => {
  const { addPlace, updatePlace } = useApp();
  const [name, setName] = useState(editingPlace ? editingPlace.name : '');
  const [area, setArea] = useState(editingPlace ? editingPlace.area : '');
  const [bufferTime, setBufferTime] = useState(editingPlace ? editingPlace.bufferTime : 30);
  
  const [errors, setErrors] = useState({
    name: '',
    area: '',
    bufferTime: ''
  });

  const validate = () => {
    let tempErrors = {
      name: '',
      area: '',
      bufferTime: ''
    };
    let isValid = true;

    if (!name.trim()) {
      tempErrors.name = 'Place name is required';
      isValid = false;
    }

    if (!area.trim()) {
      tempErrors.area = 'Area is required';
      isValid = false;
    }

    if (!bufferTime || bufferTime <= 0) {
      tempErrors.bufferTime = 'Buffer time must be greater than 0';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const placeData = {
      name,
      area,
      bufferTime: parseInt(bufferTime, 10)
    };
    
    if (editingPlace) {
      updatePlace(editingPlace.id, { ...placeData, id: editingPlace.id });
    } else {
      addPlace(placeData);
    }
    
    // Reset form if adding new place
    if (!editingPlace) {
      setName('');
      setArea('');
      setBufferTime(30);
    }
    
    // Cancel editing if in edit mode
    if (onCancel && editingPlace) {
      onCancel();
    }
  };

  return (
    <FormContainer>
      <FormTitle>{editingPlace ? 'Edit Place' : 'Add New Place'}</FormTitle>
      <form onSubmit={handleSubmit}>
        <Input
          label="Place Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter place name"
          error={errors.name}
        />
        
        <Input
          label="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter area (e.g., Tanjung Tokong)"
          error={errors.area}
        />
        
        <Input
          label="Buffer Time (minutes)"
          type="number"
          value={bufferTime}
          onChange={(e) => setBufferTime(e.target.value)}
          placeholder="Enter buffer time for travel within same area"
          min="0"
          error={errors.bufferTime}
        />
        
        <ButtonContainer>
          <Button primary type="submit">
            {editingPlace ? 'Update Place' : 'Add Place'}
          </Button>
          
          {editingPlace && (
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default PlaceForm;
