import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { useApp } from '../../contexts/AppContext';
import AvailabilityRuleForm from './AvailabilityRuleForm';

const ListContainer = styled.div`
  margin-bottom: 20px;
`;

const RuleCard = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
`;

const RuleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PlaceName = styled.h4`
  margin: 0;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const RuleDetails = styled.div`
  border-top: 1px solid #eee;
  padding-top: 10px;
`;

const RuleItem = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: center;
`;

const Day = styled.span`
  font-weight: 600;
  width: 100px;
`;

const Time = styled.span`
  color: #555;
`;

const EmptyMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  border: 1px dashed #ccc;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const AvailabilityRulesList = () => {
  const { availabilityRules, places, deleteAvailabilityRule } = useApp();
  const [editingRule, setEditingRule] = useState(null);

  const getPlaceName = (placeId) => {
    const place = places.find(p => p.id === placeId);
    return place ? place.name : 'Unknown Place';
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this availability rule? This action cannot be undone.')) {
      deleteAvailabilityRule(id);
    }
  };

  const cancelEditing = () => {
    setEditingRule(null);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <ListContainer>
      {editingRule && <AvailabilityRuleForm editingRule={editingRule} onCancel={cancelEditing} />}
      
      {availabilityRules.length > 0 ? (
        availabilityRules.map((rule) => (
          <RuleCard key={rule.id}>
            <RuleHeader>
              <PlaceName>{getPlaceName(rule.placeId)}</PlaceName>
              <ActionButtons>
                <Button onClick={() => handleEdit(rule)}>Edit</Button>
                <Button onClick={() => handleDelete(rule.id)}>Delete</Button>
              </ActionButtons>
            </RuleHeader>
            
            <RuleDetails>
              {rule.rules.map((dayRule, index) => (
                <RuleItem key={index}>
                  <Day>{capitalizeFirstLetter(dayRule.day)}</Day>
                  <Time>{dayRule.startTime} to {dayRule.endTime}</Time>
                </RuleItem>
              ))}
            </RuleDetails>
          </RuleCard>
        ))
      ) : (
        <EmptyMessage>No availability rules found. Add your first rule above.</EmptyMessage>
      )}
    </ListContainer>
  );
};

export default AvailabilityRulesList;
