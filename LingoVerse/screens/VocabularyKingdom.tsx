import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import GameHeader from '../components/GameHeader';

const CATEGORIES = {
  daily: 'Günlük Yaşam',
  food: 'Yemek',
  travel: 'Seyahat',
  business: 'İş Hayatı',
  education: 'Eğitim',
  technology: 'Teknoloji',
  nature: 'Doğa',
  health: 'Sağlık'
};

const LEVELS = {
  A1: 'Başlangıç',
  A2: 'Temel',
  B1: 'Orta',
  B2: 'Orta-İleri',
  C1: 'İleri'
};
const wordsByLanguage = {
  en: [
    // A1 - Günlük Yaşam
    { word: 'Hello', translation: 'Merhaba', example: 'Hello, how are you?', level: 'A1', category: 'daily' },
    { word: 'Goodbye', translation: 'Hoşça kal', example: 'Goodbye, see you tomorrow!', level: 'A1', category: 'daily' },
    { word: 'Thank you', translation: 'Teşekkürler', example: 'Thank you for your help.', level: 'A1', category: 'daily' },
    { word: 'Please', translation: 'Lütfen', example: 'Please help me.', level: 'A1', category: 'daily' },
    { word: 'Good morning', translation: 'Günaydın', example: 'Good morning! How are you?', level: 'A1', category: 'daily' },
    { word: 'Good night', translation: 'İyi geceler', example: 'Good night, sleep well!', level: 'A1', category: 'daily' },
    { word: 'Friend', translation: 'Arkadaş', example: 'She is my friend.', level: 'A1', category: 'daily' },
    { word: 'Family', translation: 'Aile', example: 'I love my family.', level: 'A1', category: 'daily' },
    { word: 'House', translation: 'Ev', example: 'This is my house.', level: 'A1', category: 'daily' },
    { word: 'School', translation: 'Okul', example: 'I go to school.', level: 'A1', category: 'daily' },

    // A1 - Yemek
    { word: 'Water', translation: 'Su', example: 'Can I have some water?', level: 'A1', category: 'food' },
    { word: 'Bread', translation: 'Ekmek', example: 'I need fresh bread.', level: 'A1', category: 'food' },
    { word: 'Apple', translation: 'Elma', example: 'I eat an apple every day.', level: 'A1', category: 'food' },
    { word: 'Coffee', translation: 'Kahve', example: 'I like black coffee.', level: 'A1', category: 'food' },
    { word: 'Tea', translation: 'Çay', example: 'Would you like some tea?', level: 'A1', category: 'food' },
    { word: 'Breakfast', translation: 'Kahvaltı', example: 'What do you eat for breakfast?', level: 'A1', category: 'food' },
    { word: 'Lunch', translation: 'Öğle yemeği', example: 'Its lunch time!', level: 'A1', category: 'food' },
    { word: 'Dinner', translation: 'Akşam yemeği', example: 'Dinner is ready!', level: 'A1', category: 'food' },
    { word: 'Fish', translation: 'Balık', example: 'I like eating fish.', level: 'A1', category: 'food' },
    { word: 'Chicken', translation: 'Tavuk', example: 'Would you like chicken?', level: 'A1', category: 'food' },
  ],
  
  es: [
    // A1 - Günlük Yaşam
    { word: 'Hola', translation: 'Merhaba', example: 'Hola, ¿cómo estás?', level: 'A1', category: 'daily' },
    { word: 'Adiós', translation: 'Hoşça kal', example: 'Adiós, ¡nos vemos mañana!', level: 'A1', category: 'daily' },
    { word: 'Gracias', translation: 'Teşekkürler', example: 'Gracias por tu ayuda.', level: 'A1', category: 'daily' },
    { word: 'Por favor', translation: 'Lütfen', example: 'Por favor, ayúdame.', level: 'A1', category: 'daily' },
    { word: 'Buenos días', translation: 'Günaydın', example: '¡Buenos días! ¿Cómo estás?', level: 'A1', category: 'daily' },
    { word: 'Buenas noches', translation: 'İyi geceler', example: 'Buenas noches, ¡que duermas bien!', level: 'A1', category: 'daily' },
    { word: 'Amigo', translation: 'Arkadaş', example: 'Ella es mi amiga.', level: 'A1', category: 'daily' },
    { word: 'Familia', translation: 'Aile', example: 'Amo a mi familia.', level: 'A1', category: 'daily' },
    { word: 'Casa', translation: 'Ev', example: 'Esta es mi casa.', level: 'A1', category: 'daily' },
    { word: 'Escuela', translation: 'Okul', example: 'Voy a la escuela.', level: 'A1', category: 'daily' },

    // A1 - Yemek
    { word: 'Agua', translation: 'Su', example: '¿Puedo tener un poco de agua?', level: 'A1', category: 'food' },
    { word: 'Pan', translation: 'Ekmek', example: 'Necesito pan fresco.', level: 'A1', category: 'food' },
    { word: 'Manzana', translation: 'Elma', example: 'Como una manzana todos los días.', level: 'A1', category: 'food' },
    { word: 'Café', translation: 'Kahve', example: 'Me gusta el café negro.', level: 'A1', category: 'food' },
    { word: 'Té', translation: 'Çay', example: '¿Te gustaría un poco de té?', level: 'A1', category: 'food' },
    { word: 'Desayuno', translation: 'Kahvaltı', example: '¿Qué desayunas?', level: 'A1', category: 'food' },
    { word: 'Almuerzo', translation: 'Öğle yemeği', example: '¡Es hora de almorzar!', level: 'A1', category: 'food' },
    { word: 'Cena', translation: 'Akşam yemeği', example: '¡La cena está lista!', level: 'A1', category: 'food' },
    { word: 'Pescado', translation: 'Balık', example: 'Me gusta comer pescado.', level: 'A1', category: 'food' },
    { word: 'Pollo', translation: 'Tavuk', example: '¿Te gustaría pollo?', level: 'A1', category: 'food' },
  ],
  
  fr: [
    // A1 - Günlük Yaşam
    { word: 'Bonjour', translation: 'Merhaba', example: 'Bonjour, comment ça va?', level: 'A1', category: 'daily' },
    { word: 'Au revoir', translation: 'Hoşça kal', example: 'Au revoir, à demain!', level: 'A1', category: 'daily' },
    { word: 'Merci', translation: 'Teşekkürler', example: 'Merci pour votre aide.', level: 'A1', category: 'daily' },
    { word: 'S’il vous plaît', translation: 'Lütfen', example: 'S’il vous plaît, aidez-moi.', level: 'A1', category: 'daily' },
    { word: 'Bonjour', translation: 'Günaydın', example: 'Bonjour ! Comment ça va ?', level: 'A1', category: 'daily' },
    { word: 'Bonne nuit', translation: 'İyi geceler', example: 'Bonne nuit, dors bien !', level: 'A1', category: 'daily' },
    { word: 'Ami', translation: 'Arkadaş', example: 'Elle est mon amie.', level: 'A1', category: 'daily' },
    { word: 'Famille', translation: 'Aile', example: 'J’aime ma famille.', level: 'A1', category: 'daily' },
    { word: 'Maison', translation: 'Ev', example: 'C’est ma maison.', level: 'A1', category: 'daily' },
    { word: 'École', translation: 'Okul', example: 'Je vais à l’école.', level: 'A1', category: 'daily' },

    // A1 - Yemek
    { word: 'Eau', translation: 'Su', example: 'Puis-je avoir de l\'eau?', level: 'A1', category: 'food' },
    { word: 'Pain', translation: 'Ekmek', example: 'J’ai besoin de pain frais.', level: 'A1', category: 'food' },
    { word: 'Pomme', translation: 'Elma', example: 'Je mange une pomme chaque jour.', level: 'A1', category: 'food' },
    { word: 'Café', translation: 'Kahve', example: 'J’aime le café noir.', level: 'A1', category: 'food' },
    { word: 'Thé', translation: 'Çay', example: 'Voudriez-vous du thé?', level: 'A1', category: 'food' },
    { word: 'Petit-déjeuner', translation: 'Kahvaltı', example: 'Que mangez-vous au petit-déjeuner?', level: 'A1', category: 'food' },
    { word: 'Déjeuner', translation: 'Öğle yemeği', example: 'C’est l’heure du déjeuner!', level: 'A1', category: 'food' },
    { word: 'Dîner', translation: 'Akşam yemeği', example: 'Le dîner est prêt!', level: 'A1', category: 'food' },
    { word: 'Poisson', translation: 'Balık', example: 'J’aime manger du poisson.', level: 'A1', category: 'food' },
    { word: 'Poulet', translation: 'Tavuk', example: 'Voulez-vous du poulet?', level: 'A1', category: 'food' },
  ],

  de: [
    // A1 - Günlük Yaşam
    { word: 'Hallo', translation: 'Merhaba', example: 'Hallo, wie geht es dir?', level: 'A1', category: 'daily' },
    { word: 'Tschüss', translation: 'Hoşça kal', example: 'Tschüss, bis morgen!', level: 'A1', category: 'daily' },
    { word: 'Danke', translation: 'Teşekkürler', example: 'Danke für deine Hilfe.', level: 'A1', category: 'daily' },
    { word: 'Bitte', translation: 'Lütfen', example: 'Bitte hilf mir.', level: 'A1', category: 'daily' },
    { word: 'Guten Morgen', translation: 'Günaydın', example: 'Guten Morgen! Wie geht’s?', level: 'A1', category: 'daily' },
    { word: 'Gute Nacht', translation: 'İyi geceler', example: 'Gute Nacht, schlaf gut!', level: 'A1', category: 'daily' },
    { word: 'Freund', translation: 'Arkadaş', example: 'Sie ist meine Freundin.', level: 'A1', category: 'daily' },
    { word: 'Familie', translation: 'Aile', example: 'Ich liebe meine Familie.', level: 'A1', category: 'daily' },
    { word: 'Haus', translation: 'Ev', example: 'Das ist mein Haus.', level: 'A1', category: 'daily' },
    { word: 'Schule', translation: 'Okul', example: 'Ich gehe zur Schule.', level: 'A1', category: 'daily' },

    // A1 - Yemek
    { word: 'Wasser', translation: 'Su', example: 'Kann ich etwas Wasser haben?', level: 'A1', category: 'food' },
    { word: 'Brot', translation: 'Ekmek', example: 'Ich brauche frisches Brot.', level: 'A1', category: 'food' },
    { word: 'Apfel', translation: 'Elma', example: 'Ich esse jeden Tag einen Apfel.', level: 'A1', category: 'food' },
    { word: 'Kaffee', translation: 'Kahve', example: 'Ich mag schwarzen Kaffee.', level: 'A1', category: 'food' },
    { word: 'Tee', translation: 'Çay', example: 'Möchtest du etwas Tee?', level: 'A1', category: 'food' },
    { word: 'Frühstück', translation: 'Kahvaltı', example: 'Was isst du zum Frühstück?', level: 'A1', category: 'food' },
    { word: 'Mittagessen', translation: 'Öğle yemeği', example: 'Es ist Mittagessenzeit!', level: 'A1', category: 'food' },
    { word: 'Abendessen', translation: 'Akşam yemeği', example: 'Das Abendessen ist fertig!', level: 'A1', category: 'food' },
    { word: 'Fisch', translation: 'Balık', example: 'Ich esse gerne Fisch.', level: 'A1', category: 'food' },
    { word: 'Hähnchen', translation: 'Tavuk', example: 'Möchtest du Hähnchen?', level: 'A1', category: 'food' },
  ],
};


export default function VocabularyKingdom() {
  const insets = useSafeAreaInsets();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedLevel, setSelectedLevel] = useState('A1');
  const [selectedCategory, setSelectedCategory] = useState('daily');
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);  const [currentWords, setCurrentWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);  useEffect(() => {
    const loadSelectedLanguage = async () => {
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
    loadSelectedLanguage();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      setCurrentWords(wordsByLanguage[selectedLanguage] || wordsByLanguage.en);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    filterWords();
  }, [selectedLevel, selectedCategory, currentWords]);  const filterWords = () => {
    if (!currentWords || !Array.isArray(currentWords)) {
      setFilteredWords([]);
      return;
    }
    
    const filtered = currentWords.filter(word => 
      word.level === selectedLevel &&
      word.category === selectedCategory
    );
    setFilteredWords(filtered);
    setCurrentWordIndex(0);
    setUserAnswer('');
    setShowResult(false);
  };

  const playWord = () => {
    if (filteredWords[currentWordIndex]) {
      Speech.speak(filteredWords[currentWordIndex].word, {
        language: selectedLanguage,
        pitch: 1,
        rate: 0.75
      });
    }
  };

  const checkAnswer = () => {
    if (!filteredWords[currentWordIndex]) return;

    const isAnswerCorrect = 
      userAnswer.toLowerCase().trim() === 
      filteredWords[currentWordIndex].translation.toLowerCase().trim();

    setIsCorrect(isAnswerCorrect);
    setShowResult(true);
    
    if (isAnswerCorrect) {
      setScore(score + 10);
    }
  };

  const nextWord = () => {
    if (currentWordIndex + 1 >= filteredWords.length) {
      // Tüm kelimeler tamamlandığında
      Alert.alert(
        'Tebrikler!',
        `Bu bölümü tamamladınız! Toplam puanınız: ${score}`,
        [
          {
            text: 'Tekrar Başla',
            onPress: () => {
              setCurrentWordIndex(0);
              setScore(0);
            }
          }
        ]
      );
    } else {
      setCurrentWordIndex(prev => prev + 1);
    }
    setUserAnswer('');
    setShowResult(false);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <GameHeader title="Kelimeler Diyarı" score={score} icon="book-open-variant" />
        
        <ScrollView style={styles.content}>
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {Object.entries(LEVELS).map(([key, value]) => (
                <Pressable
                  key={key}
                  style={[
                    styles.filterButton,
                    selectedLevel === key && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedLevel(key)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedLevel === key && styles.filterButtonTextActive
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {Object.entries(CATEGORIES).map(([key, value]) => (
                <Pressable
                  key={key}
                  style={[
                    styles.filterButton,
                    selectedCategory === key && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedCategory(key)}
                >
                  <Text style={[
                    styles.filterButtonText,
                    selectedCategory === key && styles.filterButtonTextActive
                  ]}>
                    {value}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentWordIndex + 1} / {filteredWords.length} Kelime
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentWordIndex + 1) / filteredWords.length) * 100}%` }]} />
            </View>
          </View>

          {filteredWords.length > 0 ? (
            <View style={styles.wordCard}>
              <View style={styles.wordHeader}>
                <Text style={styles.wordText}>
                  {filteredWords[currentWordIndex].word}
                </Text>
                <Pressable onPress={playWord} style={styles.playButton}>
                  <MaterialCommunityIcons name="volume-high" size={24} color="white" />
                </Pressable>
              </View>

              <Text style={styles.exampleText}>
                {filteredWords[currentWordIndex].example}
              </Text>

              <View style={styles.answerContainer}>
                <TextInput
                  style={styles.answerInput}
                  placeholder="Çevirisini yazın..."
                  placeholderTextColor="#9E9E9E"
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  onSubmitEditing={checkAnswer}
                />
                <Pressable style={styles.checkButton} onPress={checkAnswer}>
                  <MaterialCommunityIcons name="check" size={24} color="white" />
                </Pressable>
              </View>

              {showResult && (
                <View style={[
                  styles.resultCard,
                  isCorrect ? styles.correctResult : styles.wrongResult
                ]}>
                  <Text style={styles.resultText}>
                    {isCorrect ? 'Doğru!' : 'Yanlış!'}
                  </Text>
                  <Text style={styles.correctAnswerText}>
                    Doğru cevap: {filteredWords[currentWordIndex].translation}
                  </Text>
                  <Pressable style={styles.nextButton} onPress={nextWord}>
                    <Text style={styles.nextButtonText}>Sonraki Kelime</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Bu kategori ve seviyede kelime bulunmuyor.
              </Text>
            </View>
          )}
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
  content: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterScroll: {
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  wordCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  wordText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 25,
  },
  exampleText: {
    fontSize: 18,
    color: '#E1BEE7',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  answerContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  answerInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
  },
  checkButton: {
    backgroundColor: '#4CAF50',
    width: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  correctResult: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  wrongResult: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  resultText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  correctAnswerText: {
    color: '#E1BEE7',
    fontSize: 16,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#E1BEE7',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
});