import React, { useState } from 'react';
import { Appbar, Menu, Surface } from 'react-native-paper';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { useDuaCategories } from '@/hooks/useDuaDhikr';
import { Ionicons } from '@expo/vector-icons';
import { useDuaDhikrTitle } from '@/hooks/useDuaDhikrTitle';
const { width, height } = Dimensions.get('screen');

const DuaDhikr = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState('Dzikir Pagi');
  const [currentSlug, setCurrentSlug] = useState('morning-dhikr');
  const category = useDuaCategories();
  const title = useDuaDhikrTitle(currentSlug);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Dua & Dhikr" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchorPosition="bottom"
          contentStyle={{ backgroundColor: '#d6dee3' }}
          anchor={
            <View className="flex flex-row items-center gap-x-0">
              <Text>{selected}</Text>
              <Appbar.Action
                icon={() => (
                  <Ionicons
                    name="chevron-down-outline"
                    size={24}
                    color="black"
                  />
                )}
                onPress={openMenu}
                accessibilityLabel="Menu"
              />
            </View>
          }
        >
          {category?.map((category, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setSelected(category.name);
                setCurrentSlug(category.slug);
                closeMenu();
              }}
              title={category.name}
            />
          ))}
        </Menu>
      </Appbar.Header>

      <ScrollView horizontal>
        {title.map((item, index) => (
          <Surface key={index} style={styles.surface}>
            <Text style={styles.titleText}>{item.title}</Text>
          </Surface>
        ))}
      </ScrollView>
    </>
  );
};

export default DuaDhikr;

const styles = StyleSheet.create({
  surface: {
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  noContentText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});
