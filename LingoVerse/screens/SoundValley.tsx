import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GameHeader from '../components/GameHeader';

const pronunciationChallenges = {
  en: [
    {
      word: 'Beautiful',
      correctPronunciation: 'byoo-tuh-fl',
      imagePrompt: 'beautiful flower in sunshine',
      tips: ['Break it into syllables: byoo-tuh-fl', 'Focus on the "u" sound in "byoo"'],
    },
    {
      word: 'Butterfly',
      correctPronunciation: 'buh-ter-fly',
      imagePrompt: 'colorful butterfly on flower',
      tips: ['Stress the first syllable: BUH-ter-fly', 'The "u" is pronounced as "uh"'],
    }
  ],
  tr: [
    {
      word: 'Güzel',
      correctPronunciation: 'gü-zel',
      imagePrompt: 'beautiful turkish scene',
      tips: ['Ü harfini doğru telaffuz edin', 'İki heceli olarak söyleyin'],
    },
    {
      word: 'Kelebek',
      correctPronunciation: 'ke-le-bek',
      imagePrompt: 'colorful butterfly on flower',
      tips: ['Üç heceli olarak söyleyin', 'Son hecedeki e harfine dikkat edin'],
    }
  ],
  de: [
    {
      word: 'Schmetterling',
      correctPronunciation: 'shmet-ter-ling',
      imagePrompt: 'beautiful butterfly',
      tips: ['Sch sesi "ş" gibi çıkar', 'ing sonunu yumuşak söyleyin'],
    },
    {
      word: 'Schön',
      correctPronunciation: 'şön',
      imagePrompt: 'beautiful scene',
      tips: ['ö harfini dudakları yuvarlayarak söyleyin', 'Tek heceli söyleyin'],
    }
  ],
  fr: [
    {
      word: 'Papillon',
      correctPronunciation: 'pa-pi-yon',
      imagePrompt: 'beautiful butterfly',
      tips: ['Son hece nazal ses çıkarır', 'İki "l" harfi "y" gibi okunur'],
    },
    {
      word: 'Belle',
      correctPronunciation: 'bel',
      imagePrompt: 'beautiful scene',
      tips: ['e harfini yarı kapalı söyleyin', 'l harflerini belirgin söyleyin'],
    }
  ],
  es: [
    {
      word: 'Mariposa',
      correctPronunciation: 'ma-ri-po-sa',
      imagePrompt: 'beautiful butterfly',
      tips: ['Her heceyi eşit vurgulayın', 'r harfini tek vuruşla söyleyin'],
    },
    {
      word: 'Hermoso',
      correctPronunciation: 'er-mo-so',
      imagePrompt: 'beautiful scene',
      tips: ['h harfi okunmaz', 'o harflerini belirgin söyleyin'],
    }
  ]
};

export default function SoundValley() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('');

  useEffect(() => {
    loadCharacterData();
  }, []);

  const loadCharacterData = async () => {
    try {
      const characterData = await AsyncStorage.getItem('@character_data');
      if (characterData) {
        const loadedCharacter = JSON.parse(characterData);
        if (loadedCharacter.language && loadedCharacter.language.id) {
          setSelectedLanguage(loadedCharacter.language.id);
        }
      }
    } catch (error) {
      console.error('Error loading character data:', error);
      Alert.alert('Hata', 'Karakter bilgileri yüklenemedi');
    }
  };
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    // Burada ses dosyasını AI'ya gönderip analiz edebiliriz
    // Şimdilik basit bir puan artışı yapalım
    setScore(prev => prev + 5);
  };  const playCurrentWord = async () => {
    const currentChallenge = pronunciationChallenges[selectedLanguage]?.[currentWord];
    if (!currentChallenge?.word) return;
    
    const languageMap = {
      'en': 'en-US',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'es': 'es-ES',
      'tr': 'tr-TR'
    };
    
    Speech.speak(currentChallenge.word, {
      language: languageMap[selectedLanguage] || 'en-US',
      pitch: 1,
      rate: 0.75,
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };  const nextWord = () => {
    if (selectedLanguage && pronunciationChallenges[selectedLanguage]) {
      setCurrentWord((prev) => 
        (prev + 1) % pronunciationChallenges[selectedLanguage].length
      );
      setShowTips(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>        <GameHeader title="Ses Vadisi" score={score} icon="microphone" />

        <View style={styles.wordCard}>          <Image
            source={{
              uri: `https://api.a0.dev/assets/image?text=${pronunciationChallenges[selectedLanguage]?.[currentWord]?.imagePrompt || 'beautiful scene'}&aspect=16:9`
            }}
            style={styles.wordImage}
          />
          <Text style={styles.wordText}>
            {pronunciationChallenges[selectedLanguage]?.[currentWord]?.word || 'Loading...'}
          </Text>
          <Text style={styles.pronunciationText}>
            /{pronunciationChallenges[selectedLanguage]?.[currentWord]?.correctPronunciation || ''}/
          </Text>
        </View>

        <View style={styles.controlsContainer}>          <View style={styles.buttonRow}>
            <Pressable
              style={styles.playButton}
              onPress={playCurrentWord}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={32}
                color="white"
              />
              <Text style={styles.buttonText}>
                Dinle
              </Text>
            </Pressable>

            <Pressable
              style={[styles.recordButton, isRecording && styles.recordingButton]}
              onPress={toggleRecording}
            >
              <MaterialCommunityIcons
                name={isRecording ? "stop" : "microphone"}
                size={32}
                color="white"
              />
              <Text style={styles.recordButtonText}>
                {isRecording ? 'Kaydı Durdur' : 'Telaffuz Et'}
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.tipsButton}
            onPress={() => setShowTips(!showTips)}
          >
            <MaterialCommunityIcons name="lightbulb" size={24} color="white" />
            <Text style={styles.tipsButtonText}>İpuçları</Text>
          </Pressable>
        </View>        {showTips && pronunciationChallenges[selectedLanguage]?.[currentWord]?.tips && (
          <View style={styles.tipsCard}>
            {pronunciationChallenges[selectedLanguage][currentWord].tips.map((tip, index) => (
              <Text key={index} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </View>
        )}

        <Pressable style={styles.nextButton} onPress={nextWord}>
          <Text style={styles.nextButtonText}>Sonraki Kelime</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 15,
  },
  score: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  wordCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  wordImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  wordText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pronunciationText: {
    fontSize: 20,
    color: '#E1BEE7',
    fontStyle: 'italic',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  recordButton: {
    flex: 2,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginRight: 10,
  },
  recordingButton: {
    backgroundColor: '#F44336',
  },
  recordButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tipsButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
  },
  tipsButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  tipsCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  tipText: {
    color: '#E1BEE7',
    fontSize: 16,
    marginBottom: 5,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});