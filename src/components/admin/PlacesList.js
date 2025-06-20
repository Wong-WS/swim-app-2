import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import PlaceForm from './PlaceForm';

const ListContainer = styled.div`
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  padding: 12px;
  text-align: left;
  background-color: #0077cc;
  color: white;
  border: 1px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
  padding: 5px 10px;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  border: 1px dashed #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const PlacesList = () => {
  const { places, deletePlace } = useApp();
  const [editingPlace, setEditingPlace] = useState(null);

  const handleEdit = (place) => {
    setEditingPlace(place);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this place? This action cannot be undone.')) {
      deletePlace(id);
    }
  };

  const cancelEditing = () => {
    setEditingPlace(null);
  };

  return (
    <ListContainer>
      {editingPlace && <PlaceForm editingPlace={editingPlace} onCancel={cancelEditing} />}
      
      {places.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Area</Th>
              <Th>Buffer Time (min)</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.id}>
                <Td>{place.name}</Td>
                <Td>{place.area}</Td>
                <Td>{place.bufferTime}</Td>
                <Td>
                  <ActionButton onClick={() => handleEdit(place)}>Edit</ActionButton>
                  <ActionButton onClick={() => handleDelete(place.id)}>Delete</ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyMessage>No places found. Add your first place above.</EmptyMessage>
      )}
    </ListContainer>
  );
};

export default PlacesList;
