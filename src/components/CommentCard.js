import React, { useEffect, useRef, useState, useContext } from 'react';
import { Alert, Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext';

const PRIMARY = '#7B2CBF';

const zamanFarki = (tarih) => {
  const simdi = new Date();
  const yorumTarihi = new Date(tarih);
  const saniye = Math.floor((simdi - yorumTarihi) / 1000);
  if (saniye < 60) return `${saniye} sn önce`;
  const dakika = Math.floor(saniye / 60);
  if (dakika < 60) return `${dakika} dk önce`;
  const saat = Math.floor(dakika / 60);
  if (saat < 24) return `${saat} sa önce`;
  const gun = Math.floor(saat / 24);
  return `${gun} gün önce`;
};

const touchableIcon = (liked, onPress, count, tarih) => (
  <View style={styles.iconRow}>
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.icon}>{liked ? '💜' : '🤍'}</Text>
    </TouchableOpacity>
    <Text style={styles.iconCount}>{count}</Text>
    <Text style={styles.iconTime}>· {zamanFarki(tarih)}</Text>
  </View>
);

function CommentCard({
  yorum,
  level = 0,
  getYanitlar,
  yanitId,
  setYanitId,
  yanitlar,
  setYanitlar,
  yanitGonder,
  setYorumlar,
}) {
  const auth = useContext(AuthContext);
  const inputRef = useRef(null);

  useEffect(() => {
    if (yanitId !== yorum._id) return;
    const timeout = setTimeout(() => {
      if (inputRef.current?.isFocused?.() === false) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [yanitId, yorum._id]);

  const altYorumlar = getYanitlar(yorum._id);
  const isAltYorum = level === 1;
  const isUser = auth?.userId === yorum.kullaniciId?.toString();

  const [duzenleModu, setDuzenleModu] = useState(false);
  const [duzenlenenMetin, setDuzenlenenMetin] = useState(yorum.yorum);

  const yorumuGuncelle = async () => {
    try {
      const { data } = await axiosClient.put(`/yorum/${yorum._id}`, {
        yorum: duzenlenenMetin,
      });
      setYorumlar(prev => prev.map(y => (y._id === yorum._id ? data : y)));
      setDuzenleModu(false);
    } catch {
      Alert.alert('Hata', 'Yorum güncellenemedi');
    }
  };

  const yorumuSil = async () => {
    Alert.alert('Yorum silinsin mi?', 'Bu işlem geri alınamaz', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosClient.delete(`/yorum/${yorum._id}`);
            setYorumlar(prev => prev.filter(y => y._id !== yorum._id));
          } catch {
            Alert.alert('Hata', 'Silme başarısız');
          }
        },
      },
    ]);
  };

  return (
    <View key={yorum._id} style={styles.card}>
      <View style={[styles.row, { paddingLeft: isAltYorum ? 48 : 0 }]}>
        <Image source={{ uri: yorum.avatarUrl }} style={styles.avatar} />
        <View style={styles.flex1}>
          <Text style={styles.name}>{yorum.kullanici}</Text>

          {duzenleModu ? (
            <>
              <TextInput
                value={duzenlenenMetin}
                onChangeText={setDuzenlenenMetin}
                style={styles.editInput}
                multiline
              />
              <TouchableOpacity onPress={yorumuGuncelle} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Kaydet</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.commentText}>{yorum.yorum}</Text>
          )}

          <View style={styles.actionRow}>
            {touchableIcon(
              yorum.begendinMi,
              async () => {
                try {
                  const { data: updated } = await axiosClient.put(`/yorum/begen/${yorum._id}`);
                  setYorumlar(prev => prev.map(item => (item._id === updated._id ? updated : item)));
                } catch {}
              },
              yorum.begeni || 0,
              yorum.tarih
            )}

            <View style={styles.replyRow}>
              <TouchableOpacity onPress={() => setYanitId(yorum._id)}>
                <Text style={{ color: PRIMARY }}>Yanıtla</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[
              styles.replyContainer,
              { display: String(yanitId) === String(yorum._id) ? 'flex' : 'none' },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={yanitlar[yorum._id] || ''}
              onChangeText={text => {
                if (yanitlar[yorum._id] !== text) {
                  setYanitlar(prev => ({ ...prev, [yorum._id]: text }));
                }
              }}
              placeholder="Yanıtınızı yazın..."
              multiline
              scrollEnabled
              blurOnSubmit={false}
              style={styles.replyInput}
            />
            <TouchableOpacity
              onPress={() => yanitGonder(yorum._id)}
              style={styles.replyButton}
            >
              <Text style={styles.replyButtonText}>Yanıtla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {altYorumlar.map(alt => (
        <CommentCard
          key={alt._id}
          yorum={alt}
          level={1}
          getYanitlar={getYanitlar}
          yanitId={yanitId}
          setYanitId={setYanitId}
          yanitlar={yanitlar}
          setYanitlar={setYanitlar}
          yanitGonder={yanitGonder}
          setYorumlar={setYorumlar}
        />
      ))}
    </View>
  );
}

export default React.memo(CommentCard);

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  row: { flexDirection: 'row' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  flex1: { flex: 1 },
  name: { fontWeight: '600' },
  editInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginVertical: 4,
  },
  saveButton: { backgroundColor: PRIMARY, padding: 6, borderRadius: 6 },
  saveButtonText: { color: '#fff' },
  commentText: { color: '#555', marginVertical: 4 },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyRow: { flexDirection: 'row', gap: 8 },
  replyContainer: { marginTop: 8 },
  replyInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  replyButton: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    alignSelf: 'flex-end',
    width: 100,
  },
  replyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  icon: { fontSize: 18 },
  iconCount: { fontSize: 12, color: '#888' },
  iconTime: { fontSize: 12, color: '#aaa' },
});
