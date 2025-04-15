import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toast } from 'sonner-native';

import GameHeader from '../components/GameHeader';
const DIFFICULTY_QUESTIONS = {
  en: {
    A1: [
      {
        question: "Which sentence uses the present continuous correctly?",
        options: [
          "I reading book now.",
          "I am reading a book now.",
          "I read book now.",
          "I does reading book now."
        ],
        correctAnswer: 1,
        points: 100,
        explanation: "Present Continuous tense uses 'am/is/are' + verb-ing"
      }
    ],
    B1: [
      {
        question: "Choose the correct past simple form:",
        options: [
          "He goed to school.",
          "He gone to school.",
          "He went to school.",
          "He going to school."
        ],
        correctAnswer: 2,
        points: 200,
        explanation: "'Went' is the correct past simple form of 'go'"
      }
    ],
    C1: [
      {
        question: "Select the correct subjunctive form:",
        options: [
          "I wish I was there.",
          "I wish I were there.",
          "I wish I would be there.",
          "I wish I am there."
        ],
        correctAnswer: 1,
        points: 300,
        explanation: "In subjunctive mood, use 'were' instead of 'was'"
      }
    ]
  },
  es: {
    A1: [
      {
        question: "¿Qué oración es correcta?",
        options: [
          "Yo estudiando ahora.",
          "Yo estoy estudiando ahora.",
          "Yo estudio ahora.",
          "Yo estudia ahora."
        ],
        correctAnswer: 1,
        points: 100,
        explanation: "El presente continuo usa 'estar' + gerundio"
      }
    ],
    B1: [
      {
        question: "Elige la forma correcta del pretérito:",
        options: [
          "Él fue a la escuela.",
          "Él ido a la escuela.",
          "Él va a la escuela.",
          "Él yendo a la escuela."
        ],
        correctAnswer: 0,
        points: 200,
        explanation: "'Fue' es la forma correcta del pretérito de 'ir'"
      }
    ],
    C1: [
      {
        question: "Selecciona el subjuntivo correcto:",
        options: [
          "Ojalá que viene.",
          "Ojalá que venga.",
          "Ojalá que vendrá.",
          "Ojalá que venir."
        ],
        correctAnswer: 1,
        points: 300,
        explanation: "Después de 'ojalá que' se usa el subjuntivo"
      }
    ]
  },
  fr: {
    A1: [
      {
        question: "Quelle phrase est correcte ?",
        options: [
          "Je étudiant maintenant.",
          "Je suis en train d'étudier maintenant.",
          "Je étudie maintenant.",
          "Je étudies maintenant."
        ],
        correctAnswer: 1,
        points: 100,
        explanation: "Le présent continu utilise 'être en train de' + infinitif"
      }
    ],
    B1: [
      {
        question: "Choisis la forme correcte du passé composé :",
        options: [
          "Il a allé à l'école.",
          "Il est allé à l'école.",
          "Il va à l'école.",
          "Il allant à l'école."
        ],
        correctAnswer: 1,
        points: 200,
        explanation: "'Aller' utilise l'auxiliaire 'être' au passé composé"
      }
    ],
    C1: [
      {
        question: "Sélectionne le subjonctif correct :",
        options: [
          "Je veux que tu viens.",
          "Je veux que tu viennes.",
          "Je veux que tu viendrais.",
          "Je veux que tu venir."
        ],
        correctAnswer: 1,
        points: 300,
        explanation: "Après 'je veux que' on utilise le subjonctif"
      }
    ]
  },
  de: {
    A1: [
      {
        question: "Welcher Satz ist richtig?",
        options: [
          "Ich studierend jetzt.",
          "Ich studiere gerade jetzt.",
          "Ich studiert jetzt.",
          "Ich studieren jetzt."
        ],
        correctAnswer: 1,
        points: 100,
        explanation: "Im Deutschen wird 'gerade' für die Verlaufsform verwendet"
      }
    ],
    B1: [
      {
        question: "Wähle die richtige Präteritumform:",
        options: [
          "Er gehte zur Schule.",
          "Er ging zur Schule.",
          "Er geht zur Schule.",
          "Er gehend zur Schule."
        ],
        correctAnswer: 1,
        points: 200,
        explanation: "'Ging' ist die korrekte Präteritumform von 'gehen'"
      }
    ],
    C1: [
      {
        question: "Wähle den richtigen Konjunktiv:",
        options: [
          "Wenn ich Zeit habe.",
          "Wenn ich Zeit hätte.",
          "Wenn ich Zeit haben.",
          "Wenn ich Zeit habend."
        ],
        correctAnswer: 1,
        points: 300,
        explanation: "Im Konjunktiv II wird 'hätte' verwendet"
      }
    ]
  }
};
    
  export default function CompetitionArena() {
  const insets = useSafeAreaInsets();
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentLevel, setCurrentLevel] = useState('A1');
  const [character, setCharacter] = useState(null);
  const [searching, setSearching] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);  const loadCharacterData = async () => {
    try {
      const characterData = await AsyncStorage.getItem('@character_data');
      if (characterData) {
        const loadedCharacter = JSON.parse(characterData);
        setCharacter(loadedCharacter);

        // Direkt olarak dil ID'sini kullan
        if (loadedCharacter.language && loadedCharacter.language.id) {
          setSelectedLanguage(loadedCharacter.language.id);
          console.log('Seçilen dil:', loadedCharacter.language.id);
        }

        if (loadedCharacter.style && loadedCharacter.style.id) {
          const level = loadedCharacter.style.id.toUpperCase();
          setCurrentLevel(level);
        }
      }
    } catch (error) {
      console.error('Error loading character data:', error);
      toast.error('Karakter bilgileri yüklenemedi');
    }
  };

  useEffect(() => {
    loadCharacterData();
  }, []);

  useEffect(() => {
    let interval;
    if (gameStarted && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      endGame();
    }
    return () => clearInterval(interval);
  }, [gameStarted, timer]);

  const startSearching = () => {
    setSearching(true);
    const opponentNames = {
      en: ['John', 'Emma', 'Michael', 'Sarah'],
      de: ['Hans', 'Angela', 'Klaus', 'Heidi'],
      fr: ['Pierre', 'Marie', 'Jean', 'Sophie'],
      es: ['Carlos', 'Maria', 'Juan', 'Ana'],
    };

    const randomName = opponentNames[selectedLanguage]?.[Math.floor(Math.random() * 4)] || 'AI Opponent';

    setTimeout(() => {
      setOpponent({
        name: randomName,
        level: currentLevel,
        score: Math.floor(Math.random() * 1000),
        language: selectedLanguage,
      });
      setSearching(false);
      startGame();
    }, 2000);
  };

  const startGame = () => {
    setGameStarted(true);
    setTimer(30);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const endGame = () => {
    setGameStarted(false);
    if (score > 500) {
      toast.success('Tebrikler! Yarışmayı kazandınız! +1000 puan');
      setScore(prev => prev + 1000);
    } else {
      toast.error('Maalesef kaybettiniz. Tekrar deneyin!');
    }
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const question = DIFFICULTY_QUESTIONS[selectedLanguage]?.[currentLevel]?.[currentQuestion];

    if (!question) {
      toast.error('Soru bulunamadı!');
      return;
    }

    if (index === question.correctAnswer) {
      setScore(prev => prev + question.points);
      toast.success('Doğru cevap!');
    } else {
      toast.error('Yanlış cevap!');
    }

    setTimeout(() => {
      const levelQuestions = DIFFICULTY_QUESTIONS[selectedLanguage]?.[currentLevel] || [];
      if (currentQuestion + 1 < levelQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        endGame();
      }
    }, 1000);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <GameHeader title="Yarışma Arenası" score={score} icon="trophy" />

        <ScrollView style={styles.content}>          {!gameStarted ? (
            <View style={styles.menuContainer}>
              {!searching ? (
                <>
                  <Pressable style={styles.startButton} onPress={startSearching}>
                    <Text style={styles.buttonText}>Rakip Ara</Text>
                  </Pressable>
                </>
              ) : opponent ? (
                <View style={styles.opponentCard}>
                  <Image
                    source={{
                      uri: `https://api.a0.dev/assets/image?text=profile picture avatar ${opponent.name}, digital art style&aspect=1:1`
                    }}
                    style={styles.opponentImage}
                  />
                  <View style={styles.opponentInfo}>
                    <Text style={styles.opponentName}>{opponent.name}</Text>
                    <Text style={styles.opponentDetail}>Seviye: {opponent.level}</Text>
                    <Text style={styles.opponentDetail}>Puan: {opponent.score}</Text>
                    <Text style={styles.opponentDetail}>Dil: {
                      opponent.language === 'en' ? 'İngilizce' :
                      opponent.language === 'de' ? 'Almanca' :
                      opponent.language === 'fr' ? 'Fransızca' :
                      opponent.language === 'es' ? 'İspanyolca' : 'Bilinmiyor'
                    }</Text>
                  </View>
                  <Pressable style={styles.startButton} onPress={() => startGame()}>
                    <Text style={styles.buttonText}>Yarışmaya Başla</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.searchingContainer}>
                  <Text style={styles.menuText}>Rakip aranıyor...</Text>
                  <MaterialCommunityIcons name="loading" size={40} color="#FFD700" />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <Text style={styles.timerText}>Süre: {timer}</Text>
              <Text style={styles.questionText}>{DIFFICULTY_QUESTIONS[selectedLanguage]?.[currentLevel]?.[currentQuestion]?.question}</Text>
              {DIFFICULTY_QUESTIONS[selectedLanguage]?.[currentLevel]?.[currentQuestion]?.options.map((opt, idx) => (
                <Pressable
                  key={idx}
                  style={[styles.optionButton, selectedAnswer === idx && styles.selectedOption]}
                  onPress={() => handleAnswer(idx)}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  content: { padding: 20 },
  menuContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  menuText: { fontSize: 20, color: '#fff', marginBottom: 20 },
  startButton: { 
    backgroundColor: '#FFD700', 
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20
  },
  buttonText: { 
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16
  },
  searchingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  opponentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '100%'
  },
  opponentImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FFD700'
  },
  opponentInfo: {
    alignItems: 'center',
    marginBottom: 15
  },
  opponentName: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  opponentDetail: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5
  },
  gameContainer: { },
  timerText: { color: '#fff', fontSize: 16, marginBottom: 10 },
  questionText: { color: '#fff', fontSize: 18, marginBottom: 20 },
  optionButton: { backgroundColor: '#444', padding: 10, marginBottom: 10, borderRadius: 8 },
  selectedOption: { backgroundColor: '#888' },
  optionText: { color: '#fff' }
});




