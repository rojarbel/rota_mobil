import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';

const PRIMARY = '#7B2CBF';

const YorumCard = memo(
  ({ yorum, yanitId, setYanitId, yanitlar, setYanitlar, yanitGonder }) => {
    const inputRef = useRef(null);
    const [localYanit, setLocalYanit] = useState(yanitlar[yorum._id] || '');

    useEffect(() => {
      if (yanitId === yorum._id) {
        const timeout = setTimeout(() => {
          inputRef.current?.focus?.();
        }, 100);
        return () => clearTimeout(timeout);
      }
    }, [yanitId, yorum._id]);

    useEffect(() => {
      setLocalYanit(yanitlar[yorum._id] || '');
    }, [yanitlar, yorum._id]);

    const handleChangeText = useCallback(
      (text) => {
        setLocalYanit(text);
        setYanitlar((prev) => {
          if (prev[yorum._id] === text) return prev;
          return { ...prev, [yorum._id]: text };
        });
      },
      [setYanitlar, yorum._id]
    );

    if (String(yanitId) !== String(yorum._id)) return null;

    return (
      <View style={{ marginTop: 8 }}>
        <TextInput
          ref={inputRef}
          value={localYanit}
          onChangeText={handleChangeText}
          placeholder="Yanıtınızı yazın..."
          multiline
          scrollEnabled
          blurOnSubmit={false}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 10,
            minHeight: 60,
          }}
        />
        <TouchableOpacity
          onPress={() => yanitGonder(yorum._id)}
          style={{
            backgroundColor: PRIMARY,
            borderRadius: 8,
            paddingVertical: 10,
            marginTop: 10,
            alignSelf: 'flex-end',
            width: 100,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
            Yanıtla
          </Text>
        </TouchableOpacity>
      </View>
    );
  },
  (prev, next) =>
    prev.yanitId === next.yanitId &&
    prev.yanitlar[prev.yorum._id] === next.yanitlar[next.yorum._id]
);

// 👇 Burayı ekle!
YorumCard.displayName = 'YorumCard';

export default YorumCard;
