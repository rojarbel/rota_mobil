// app/arama-sonuclari.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axiosClient from "../src/api/axiosClient";
import { useCallback } from 'react';
import logger from '../src/utils/logger';

export default function AramaSonuclari() {
  const { q, sehir } = useLocalSearchParams();
  const [etkinlikler, setEtkinlikler] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

useEffect(() => {
  const fetch = async () => {
    try {
      let endpoint = '';
      if (sehir) {
        endpoint = `/etkinlik?sehir=${encodeURIComponent(sehir)}`;
      } else if (q) {
        endpoint = `/etkinlik/search?q=${encodeURIComponent(q)}`;
      }

      const res = await axiosClient.get(endpoint);

      const etkinlikler = res.data.map(e => ({
        ...e,
        id: e.id || e._id?.toString(),
      }));

      setEtkinlikler(etkinlikler);
    } catch (err) {
      logger.error('Etkinlik alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [q, sehir]);

const renderItem = useCallback(({ item }) => (
  <TouchableOpacity
    onPress={() =>
      router.push({ pathname: '/etkinlik/[id]', params: { id: item.id } })
    }
    style={styles.card}
  >
  <Image
    source={{ uri: `https://rotabackend-f4gqewcbfcfud4ac.qatarcentral-01.azurewebsites.net${item.gorsel}` }}

      style={styles.image}
      resizeMode="cover"
    />
    <Text style={styles.title}>
      {item.baslik}
    </Text>
    <Text style={styles.meta}>
      {item.sehir} • {item.tarih}
    </Text>
    <Text style={styles.info}>
      {(item.fiyat && item.fiyat !== '0') ? `${item.fiyat} ₺` : 'Ücretsiz'} • {item.kategori}
    </Text>
  </TouchableOpacity>
), []);

  return (
    <View style={styles.container}>
        <Text style={styles.header}>
        {q || sehir} için sonuçlar
        </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6c5ce7" />
      ) : etkinlikler.length === 0 ? (
        <Text style={styles.empty}>Etkinlik bulunamadı.</Text>
      ) : (
      <FlatList
        data={etkinlikler}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
      />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 270,
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  info: {
    marginTop: 4,
    color: '#333',
    fontWeight: '500',
  },
  empty: {
    color: '#888',
  },
});

