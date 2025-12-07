import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';

// Import screens
import HomeScreen from './screens/HomeScreen';
import EventListScreen from './screens/EventListScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EditEventScreen from './screens/EditEventScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import GuestListScreen from './screens/GuestListScreen';
import AddGuestScreen from './screens/AddGuestScreen';
import VendorListScreen from './screens/VendorListScreen';
import AddVendorScreen from './screens/AddVendorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Events Stack Navigator
function EventsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="EventList" 
        component={EventListScreen}
        options={{ title: 'My Events' }}
      />
      <Stack.Screen 
        name="CreateEvent" 
        component={CreateEventScreen}
        options={{ title: 'Create Event' }}
      />
      <Stack.Screen 
        name="EditEvent" 
        component={EditEventScreen}
        options={{ title: 'Edit Event' }}
      />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{ title: 'Event Details' }}
      />
      <Stack.Screen 
        name="GuestList" 
        component={GuestListScreen}
        options={{ title: 'Guest List' }}
      />
      <Stack.Screen 
        name="AddGuest" 
        component={AddGuestScreen}
        options={{ title: 'Add Guest' }}
      />
      <Stack.Screen 
        name="VendorList" 
        component={VendorListScreen}
        options={{ title: 'Vendors' }}
      />
      <Stack.Screen 
        name="AddVendor" 
        component={AddVendorScreen}
        options={{ title: 'Add Vendor' }}
      />
    </Stack.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen 
          name="Events" 
          component={EventsStack}
          options={{
            headerShown: false,
            tabBarLabel: 'Events',
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 24, color }}>📅</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
