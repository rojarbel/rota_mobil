import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const BottomTabBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: 'Ana Sayfa', icon: 'home-outline', path: '/' },
    { name: 'Şehrimde', icon: 'location-outline', path: '/sehrimde' },
    { name: 'Favorilerim', icon: 'heart-outline', path: '/favorilerim' },
    { name: 'Etkinlik Ekle', icon: 'add-circle-outline', path: '/etkinlik-ekle' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => router.push(tab.path)}
          style={styles.tab}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={pathname === tab.path ? '#6c5ce7' : 'gray'}
          />
          <Text
            style={[
              styles.tabText,
              { color: pathname === tab.path ? '#6c5ce7' : 'gray' },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 10,
  },
});

export default BottomTabBar;
