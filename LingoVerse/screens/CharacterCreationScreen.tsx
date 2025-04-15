import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const LANGUAGES = [
  { id: 'en', name: 'İngilizce', flag: '🇬🇧', code: 'en' },
  { id: 'es', name: 'İspanyolca', flag: '🇪🇸', code: 'es' },
  { id: 'fr', name: 'Fransızca', flag: '🇫🇷', code: 'fr' },
  { id: 'de', name: 'Almanca', flag: '🇩🇪', code: 'de' },
];

const CHARACTER_STYLES = [
  { id: 'a1', name: 'Başlangıç (A1)', icon: '📚', description: 'Dil öğrenmeye yeni başlayanlar için' },
  { id: 'b1', name: 'Orta Seviye (B1)', icon: '📖', description: 'Temel iletişim becerilerine sahip olanlar için' },
  { id: 'c1', name: 'İleri Seviye (C1)', icon: '🎓', description: 'Akıcı konuşma becerisi olanlar için' },
];

const GENDERS = [
  { id: 'male', name: 'Erkek', icon: '👨' },
  { id: 'female', name: 'Kadın', icon: '👩' },
];



export default function CharacterCreationScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);  const [characterStyle, setCharacterStyle] = useState(CHARACTER_STYLES[0]);
  const [selectedGender, setSelectedGender] = useState(GENDERS[0]);  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen bir karakter ismi girin!');
      return;
    }

    const characterData = {
      name,
      language: selectedLanguage,      style: characterStyle,
      gender: selectedGender,
      createdAt: new Date().toISOString(),
      level: 1,
      points: 0
    };

    try {
      await AsyncStorage.setItem('@character_data', JSON.stringify(characterData));
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Hata', 'Karakter kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn} style={styles.header}>
            <Text style={styles.title}>Karakterini Oluştur</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)} style={styles.characterPreview}>
            <Image            source={{
              uri: `https://api.a0.dev/assets/image?text=${selectedGender.id === 'male' ? 'cute male' : 'cute female'} character, chibi style, soft colors, kawaii drawing, gentle shading, adorable expression, pastel background&aspect=1:1`
            }}
              style={styles.characterImage}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Karakter İsmi</Text>
            <TextInput
              style={styles.input}
              placeholder="İsminizi girin..."
              placeholderTextColor="#9E9E9E"
              value={name}
              onChangeText={setName}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Öğrenmek İstediğin Dil</Text>
            <View style={styles.optionsGrid}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.id}
                  style={[
                    styles.option,
                    selectedLanguage.id === lang.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={styles.optionText}>
                    {lang.flag} {lang.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>          <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
            <Text style={styles.sectionTitle}>Cinsiyet</Text>
            <View style={styles.optionsGrid}>
              {GENDERS.map((gender) => (
                <Pressable
                  key={gender.id}
                  style={[
                    styles.option,
                    selectedGender.id === gender.id && styles.selectedOption,
                  ]}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text style={styles.optionText}>
                    {gender.icon} {gender.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800)} style={styles.section}>
            <Text style={styles.sectionTitle}>Dil Seviyesi</Text>
            <View style={styles.optionsGrid}>
              {CHARACTER_STYLES.map((style) => (
                <Pressable
                  key={style.id}
                  style={[
                    styles.option,
                    characterStyle.id === style.id && styles.selectedOption,
                  ]}
                  onPress={() => setCharacterStyle(style)}
                >
                  <Text style={styles.optionText}>
                    {style.icon} {style.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(1400)} style={styles.buttonContainer}>
            <Pressable onPress={handleCreate} style={styles.createButton}>
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Maceraya Başla!</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  characterPreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E1BEE7',
    marginBottom: 10,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedColorOption: {
    borderColor: '#FFD700',
    borderWidth: 3,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  createButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});