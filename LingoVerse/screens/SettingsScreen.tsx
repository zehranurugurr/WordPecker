import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Switch, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('tr');

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('@user_settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotifications(parsedSettings.notifications ?? true);
        setSoundEnabled(parsedSettings.soundEnabled ?? true);
        setDarkMode(parsedSettings.darkMode ?? true);
        setSelectedLanguage(parsedSettings.language ?? 'tr');
      }

      const userData = await AsyncStorage.getItem('@current_user');
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.username || '');
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key, value) => {
    try {
      const currentSettings = await AsyncStorage.getItem('@user_settings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem('@user_settings', JSON.stringify(settings));
      toast.success('Ayarlar kaydedildi');
    } catch (error) {
      toast.error('Ayarlar kaydedilemedi');
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const users = await AsyncStorage.getItem('@users');
      let parsedUsers = users ? JSON.parse(users) : [];
      
      const currentUser = await AsyncStorage.getItem('@current_user');
      const user = JSON.parse(currentUser);
      
      // Kullanıcı bilgilerini güncelle
      const updatedUser = { ...user, username, email };
      await AsyncStorage.setItem('@current_user', JSON.stringify(updatedUser));
      
      // Kullanıcılar listesini güncelle
      parsedUsers = parsedUsers.map(u => 
        u.id === user.id ? { ...u, username, email } : u
      );
      await AsyncStorage.setItem('@users', JSON.stringify(parsedUsers));
      
      toast.success('Profil güncellendi');
      setShowProfileModal(false);
    } catch (error) {
      toast.error('Profil güncellenemedi');
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error('Yeni şifreler eşleşmiyor');
        return;
      }

      const currentUser = await AsyncStorage.getItem('@current_user');
      const user = JSON.parse(currentUser);
      
      const users = await AsyncStorage.getItem('@users');
      let parsedUsers = users ? JSON.parse(users) : [];
      
      const userIndex = parsedUsers.findIndex(u => u.id === user.id);
      
      if (parsedUsers[userIndex].password !== currentPassword) {
        toast.error('Mevcut şifre yanlış');
        return;
      }

      // Şifreyi güncelle
      parsedUsers[userIndex].password = newPassword;
      await AsyncStorage.setItem('@users', JSON.stringify(parsedUsers));
      
      toast.success('Şifre başarıyla güncellendi');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Şifre güncellenemedi');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@current_user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error) {
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  const settings = [
    {
      title: 'Hesap',
      icon: 'account',
      items: [
        { 
          title: 'Profili Düzenle',
          icon: 'account-edit',
          onPress: () => setShowProfileModal(true),
          type: 'button'
        },
        { 
          title: 'Şifre Değiştir',
          icon: 'lock-reset',
          onPress: () => setShowPasswordModal(true),
          type: 'button'
        },
        { 
          title: 'Bildirimler',
          icon: 'bell-outline',
          type: 'switch',
          value: notifications,
          onValueChange: (value) => {
            setNotifications(value);
            saveSettings('notifications', value);
          }
        }
      ]
    },
    {
      title: 'Uygulama',
      icon: 'apps',
      items: [
        { 
          title: 'Ses',
          icon: 'volume-high',
          type: 'switch',
          value: soundEnabled,
          onValueChange: (value) => {
            setSoundEnabled(value);
            saveSettings('soundEnabled', value);
          }
        },
        { 
          title: 'Karanlık Mod',
          icon: 'theme-light-dark',
          type: 'switch',
          value: darkMode,
          onValueChange: (value) => {
            setDarkMode(value);
            saveSettings('darkMode', value);
          }
        },
        {
          title: 'Dil',
          icon: 'translate',
          type: 'button',
          onPress: () => Alert.alert(
            'Dil Seçimi',
            'Şu anda sadece Türkçe desteklenmektedir.',
            [{ text: 'Tamam' }]
          )
        }
      ]
    },
    {
      title: 'Diğer',
      icon: 'dots-horizontal',
      items: [
        { 
          title: 'Yardım',
          icon: 'help-circle',
          type: 'button',
          onPress: () => Alert.alert(
            'Yardım',
            'Destek için: support@lingoverse.com',
            [{ text: 'Tamam' }]
          )
        },
        { 
          title: 'Hakkında',
          icon: 'information',
          type: 'button',
          onPress: () => Alert.alert(
            'Hakkında',
            'LingoVerse v1.0.0\n© 2025 LingoVerse',
            [{ text: 'Tamam' }]
          )
        },
        { 
          title: 'Çıkış Yap',
          icon: 'logout',
          type: 'button',
          onPress: handleLogout
        }
      ]
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </Pressable>
          <Text style={styles.title}>Ayarlar</Text>
        </View>

        <ScrollView style={styles.content}>
          {settings.map((section, index) => (
            <View key={index} style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name={section.icon} size={24} color="#E1BEE7" />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>

              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <MaterialCommunityIcons name={item.icon} size={24} color="white" />
                    <Text style={styles.settingItemText}>{item.title}</Text>
                  </View>
                  
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#767577', true: '#4CAF50' }}
                      thumbColor={item.value ? '#fff' : '#f4f3f4'}
                    />
                  ) : (
                    <Pressable onPress={item.onPress}>
                      <MaterialCommunityIcons name="chevron-right" size={24} color="#E1BEE7" />
                    </Pressable>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Profil Düzenleme Modal */}
        <Modal
          visible={showProfileModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Profili Düzenle</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Kullanıcı Adı"
                placeholderTextColor="#9E9E9E"
                value={username}
                onChangeText={setUsername}
              />
              
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowProfileModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleProfileUpdate}
                >
                  <Text style={styles.modalButtonText}>Kaydet</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Şifre Değiştirme Modal */}
        <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Şifre Değiştir</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Mevcut Şifre"
                placeholderTextColor="#9E9E9E"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre"
                placeholderTextColor="#9E9E9E"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre Tekrar"
                placeholderTextColor="#9E9E9E"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.modalButtonText}>İptal</Text>
                </Pressable>
                
                <Pressable
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handlePasswordChange}
                >
                  <Text style={styles.modalButtonText}>Değiştir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1BEE7',
    marginLeft: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#2D2D2D',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});