import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PlaceForm from './PlaceForm';
import PlacesList from './PlacesList';
import AvailabilityRuleForm from './AvailabilityRuleForm';
import AvailabilityRulesList from './AvailabilityRulesList';
import BookingsList from './BookingsList';
import Button from '../common/Button';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const Navigation = styled.div`
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
`;

const TabButton = styled.button`
  padding: 10px 15px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: ${props => props.$active ? '700' : '400'};
  color: ${props => props.$active ? '#0077cc' : '#333'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? '#0077cc' : 'transparent'};
  
  &:hover {
    color: #0077cc;
  }
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
`;

const HomeLink = styled(Link)`
  padding: 10px 15px;
  text-decoration: none;
  background-color: white;
  color: #0077cc;
  border: 1px solid #0077cc;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('places');

  return (
    <DashboardContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <HomeLink to="/">Go to Booking Page</HomeLink>
      </Header>
      
      <Navigation>
        <TabButton
          $active={activeTab === 'places'}
          onClick={() => setActiveTab('places')}
        >
          Places
        </TabButton>
        <TabButton
          $active={activeTab === 'availability'}
          onClick={() => setActiveTab('availability')}
        >
          Availability Rules
        </TabButton>
        <TabButton
          $active={activeTab === 'bookings'}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </TabButton>
      </Navigation>
      
      {activeTab === 'places' && (
        <Section>
          <SectionTitle>Manage Places</SectionTitle>
          <PlaceForm />
          <PlacesList />
        </Section>
      )}
      
      {activeTab === 'availability' && (
        <Section>
          <SectionTitle>Manage Availability Rules</SectionTitle>
          <AvailabilityRuleForm />
          <AvailabilityRulesList />
        </Section>
      )}
      
      {activeTab === 'bookings' && (
        <Section>
          <SectionTitle>Manage Bookings</SectionTitle>
          <BookingsList />
        </Section>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
