import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../common/Input';
import Select from '../common/Select';
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

const RuleContainer = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
`;

const RuleTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const AddRuleButton = styled(Button)`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #e53935;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const weekdays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" }
];

const AvailabilityRuleForm = ({ editingRule, onCancel }) => {
  const { places, addAvailabilityRule, updateAvailabilityRule } = useApp();
  const [placeId, setPlaceId] = useState(editingRule ? editingRule.placeId : '');
  const [rules, setRules] = useState(editingRule ? editingRule.rules : [
    { day: "monday", startTime: "10:00", endTime: "18:00" }
  ]);
  
  const [errors, setErrors] = useState({
    placeId: '',
    rules: []
  });

  // Initialize rule errors based on number of rules
  useEffect(() => {
    setErrors(prev => ({
      ...prev,
      rules: rules.map(() => ({ day: '', startTime: '', endTime: '' }))
    }));
  }, [rules.length]);

  const validateRule = (rule, index) => {
    const ruleErrors = { day: '', startTime: '', endTime: '' };
    let isValid = true;

    if (!rule.day) {
      ruleErrors.day = 'Day is required';
      isValid = false;
    }

    if (!rule.startTime) {
      ruleErrors.startTime = 'Start time is required';
      isValid = false;
    }

    if (!rule.endTime) {
      ruleErrors.endTime = 'End time is required';
      isValid = false;
    }

    if (rule.startTime && rule.endTime && rule.startTime >= rule.endTime) {
      ruleErrors.endTime = 'End time must be after start time';
      isValid = false;
    }

    return { isValid, ruleErrors };
  };

  const validate = () => {
    let formIsValid = true;
    let tempErrors = {
      placeId: '',
      rules: rules.map(() => ({ day: '', startTime: '', endTime: '' }))
    };

    // Validate placeId
    if (!placeId) {
      tempErrors.placeId = 'Place is required';
      formIsValid = false;
    }

    // Validate each rule
    rules.forEach((rule, index) => {
      const { isValid, ruleErrors } = validateRule(rule, index);
      tempErrors.rules[index] = ruleErrors;
      if (!isValid) formIsValid = false;
    });

    // Check for duplicate days
    const days = rules.map(r => r.day);
    const hasDuplicates = days.some((day, index) => days.indexOf(day) !== index);
    
    if (hasDuplicates) {
      formIsValid = false;
      rules.forEach((rule, index) => {
        if (days.indexOf(rule.day) !== index && days.indexOf(rule.day) > -1) {
          tempErrors.rules[index].day = 'Duplicate day';
        }
      });
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleAddRule = () => {
    setRules([...rules, { day: "monday", startTime: "10:00", endTime: "18:00" }]);
  };

  const handleRemoveRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index, field, value) => {
    const updatedRules = [...rules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setRules(updatedRules);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const ruleData = {
      placeId,
      rules
    };
    
    if (editingRule) {
      updateAvailabilityRule(editingRule.id, { ...ruleData, id: editingRule.id });
    } else {
      addAvailabilityRule(ruleData);
    }
    
    // Reset form if adding new rule
    if (!editingRule) {
      setPlaceId('');
      setRules([{ day: "monday", startTime: "10:00", endTime: "18:00" }]);
    }
    
    // Cancel editing if in edit mode
    if (onCancel && editingRule) {
      onCancel();
    }
  };

  return (
    <FormContainer>
      <FormTitle>{editingRule ? 'Edit Availability Rule' : 'Add New Availability Rule'}</FormTitle>
      <form onSubmit={handleSubmit}>
        <Select
          label="Place"
          value={placeId}
          onChange={(e) => setPlaceId(e.target.value)}
          options={places.map(place => ({ value: place.id, label: place.name }))}
          error={errors.placeId}
        />
        
        <h4>Availability Rules</h4>
        {rules.map((rule, index) => (
          <RuleContainer key={index}>
            <RuleTitle>
              Rule #{index + 1}
              {rules.length > 1 && (
                <RemoveButton type="button" onClick={() => handleRemoveRule(index)}>
                  Remove
                </RemoveButton>
              )}
            </RuleTitle>
            
            <Select
              label="Day"
              value={rule.day}
              onChange={(e) => handleRuleChange(index, 'day', e.target.value)}
              options={weekdays}
              error={errors.rules[index]?.day}
            />
            
            <Input
              label="Start Time"
              type="time"
              value={rule.startTime}
              onChange={(e) => handleRuleChange(index, 'startTime', e.target.value)}
              error={errors.rules[index]?.startTime}
            />
            
            <Input
              label="End Time"
              type="time"
              value={rule.endTime}
              onChange={(e) => handleRuleChange(index, 'endTime', e.target.value)}
              error={errors.rules[index]?.endTime}
            />
          </RuleContainer>
        ))}
        
        <AddRuleButton type="button" onClick={handleAddRule}>
          Add Another Day Rule
        </AddRuleButton>
        
        <ButtonContainer>
          <Button primary type="submit">
            {editingRule ? 'Update Rule' : 'Add Rule'}
          </Button>
          
          {editingRule && (
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default AvailabilityRuleForm;
