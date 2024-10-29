import { TafsirItem } from '@/constants/types';
import { Octicons } from '@expo/vector-icons';
import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';

const TafseerModal = ({
  tafseer,
  nomorAyat,
  namaSurat,
}: {
  tafseer: TafsirItem[];
  nomorAyat: number;
  namaSurat: string | undefined;
}) => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.container}
        >
          <View className="flex flex-row justify-center items-center py-4">
            <Text className="font-bold text-xl">{namaSurat}</Text>
            <Text className="text-2xl">/</Text>
            <Text>Tafsir Ayat ke-{nomorAyat}</Text>
          </View>
          <ScrollView className=" mx-4">
            {tafseer.length > 0 ? (
              <Text className="text-gray-700">
                {tafseer[nomorAyat - 1]?.teks || 'Tafseer not available.'}
              </Text>
            ) : (
              <Text className="text-gray-700 mb-5">Loading tafseer...</Text>
            )}
          </ScrollView>
          <TouchableOpacity
            onPress={hideModal}
            className="flex items-center justify-center py-4"
          >
            <Text className=" text-custom-blue font-bold text-lg">Tutup</Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
      <TouchableOpacity onPress={showModal} accessibilityLabel="Show Tafseer">
        <Octicons name="info" size={24} color="#39A7FF" />
      </TouchableOpacity>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    maxHeight: '90%', // Set the maximum height to 50%
  },
});

export default TafseerModal;
