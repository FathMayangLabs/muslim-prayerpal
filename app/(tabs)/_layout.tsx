import { Tabs } from 'expo-router';
import React from 'react';
import {
  Bookmark,
  HandDoa,
  Lamp,
  Quran,
  Shalah,
} from '@/assets/icons/tab-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Quran color={focused ? '#246ba4' : '#3C495E'} />
          ),
        }}
      />
      <Tabs.Screen
        name="translate-version"
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="abjad-arabic"
              size={32}
              color={focused ? '#246ba4' : '#3C495E'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer-schedule"
        options={{
          tabBarIcon: ({ focused }) => (
            <Shalah color={focused ? '#246ba4' : '#3C495E'} />
          ),
        }}
      />
      <Tabs.Screen
        name="dua-dhikr"
        options={{
          tabBarIcon: ({ focused }) => (
            <HandDoa color={focused ? '#246ba4' : '#3C495E'} />
          ),
        }}
      />
      <Tabs.Screen
        name="test3"
        options={{
          tabBarIcon: ({ focused }) => (
            <Bookmark color={focused ? '#246ba4' : '#3C495E'} />
          ),
        }}
      />
      <Tabs.Screen
        name="detail"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="duadetails"
        options={{
          href: null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Tabs>
  );
}
