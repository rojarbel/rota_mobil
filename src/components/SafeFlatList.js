import React from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';
import logger from '../utils/logger';

const SafeFlatList = ({ data, renderItem, keyExtractor, ...props }) => {
  const safeRenderItem = ({ item, index }) => {
    try {
      if (!item || typeof item !== 'object') return null;
      return renderItem({ item, index });
    } catch (e) {
      logger.warn('renderItem error at index', index, e);

      return <Text style={styles.error}>Hatalı içerik: {index}</Text>;
    }
  };

  const safeKeyExtractor = (item, index) => {
    try {
      if (!item || !item._id) return `key-${index}`;
      return item._id.toString();
    } catch {
      return `fallback-${index}`;
    }
  };

  return (
    <FlatList
      data={data}
      renderItem={safeRenderItem}
      keyExtractor={keyExtractor || safeKeyExtractor}
      {...props}
    />
  );
};

export default SafeFlatList;

const styles = StyleSheet.create({
  error: {
    color: 'red',
    padding: 10,
  },
});
