import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import GameHeader from '../components/GameHeader';



export default function GrammarCanyon() {
  const insets = useSafeAreaInsets();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);  
  const [selectedLanguage, setSelectedLanguage] = useState('en');  
  const [loading, setLoading] = useState(true);
const grammarQuestions = {
  en: [
    {
      level: 'A1',
      category: 'Present Simple',
      question: 'Which sentence is correct?',
      options: [
        'I reading a book now.',
        'I am reading a book now.',
        'I read a book now.',
        'I reads a book now.'
      ],
      correctAnswer: 1,
      explanation: 'Present Continuous (I am + verb-ing) is used for actions happening now.'
    },
    {
      level: 'A1',
      category: 'Past Simple',
      question: 'Fill in the blank: "Yesterday, I ____ to school."',
      options: [
        'go',
        'went',
        'going',
        'goes',
      ],
      correctAnswer: 1,
      explanation: 'Past simple (düzensiz fiil: go → went) kullanılır çünkü "yesterday" geçmiş zaman belirtir.',
    },
    {
      level: 'A1',
      category: 'Articles',
      question: 'Choose the correct article: "I saw ____ elephant at the zoo."',
      options: [
        'a',
        'an',
        'the',
        'no article',
      ],
      correctAnswer: 1,
      explanation: 'Sesli harfle başlayan tekil isimlerden önce "an" kullanılır.',
    },

    // A2 Seviyesi
    {
      level: 'A2',
      category: 'Present Perfect',
      question: 'Which is correct? "I ____ my homework already."',
      options: [
        'finish',
        'finished',
        'have finished',
        'am finishing',
      ],
      correctAnswer: 2,
      explanation: 'Present Perfect (have/has + past participle) kullanılır çünkü geçmişte yapılıp etkisi devam eden bir eylem.',
    },
    {
      level: 'A2',
      category: 'Modal Verbs',
      question: 'Fill in: "You ____ study hard to pass the exam."',
      options: [
        'must',
        'should',
        'can',
        'may',
      ],
      correctAnswer: 0,
      explanation: 'Must zorunluluk bildirir. Sınavı geçmek için çalışmak zorunludur.',
    },

    // B1 Seviyesi
    {
      level: 'B1',
      category: 'Conditionals',
      question: 'Complete: "If it rains tomorrow, I ____ at home."',
      options: [
        'will stay',
        'would stay',
        'stayed',
        'stay',
      ],
      correctAnswer: 0,
      explanation: 'First Conditional (if + present simple, will + infinitive) gelecekteki olası durumlar için kullanılır.',
    },
    {
      level: 'B1',
      category: 'Passive Voice',
      question: 'Choose the passive form: "They build houses."',
      options: [
        'Houses build.',
        'Houses are built.',
        'Houses were build.',
        'Houses have build.',
      ],
      correctAnswer: 1,
      explanation: 'Passive Voice (be + past participle) nesneyi özne yapmak için kullanılır.',
    },

    // B2 Seviyesi
    {
      level: 'B2',
      category: 'Reported Speech',
      question: 'Change to reported speech: He said "I am tired."',
      options: [
        'He said I am tired.',
        'He said he was tired.',
        'He said he is tired.',
        'He said I was tired.',
      ],
      correctAnswer: 1,
      explanation: 'Reported Speech\'te present tense past tense\'e dönüşür.',
    },
    {
      level: 'B2',
      category: 'Wish Clauses',
      question: 'Complete: "I wish I ____ rich."',
      options: [
        'am',
        'was',
        'were',
        'would be',
      ],
      correctAnswer: 2,
      explanation: 'Wish + past simple/were şimdiki zamanda gerçek olmayan dilekleri ifade eder.',
    },

    // C1 Seviyesi
    {
      level: 'C1',
      category: 'Mixed Conditionals',
      question: 'Choose: "If I had studied harder, I ____ a better job now."',
      options: [
        'would have',
        'would have had',
        'would had',
        'would have having',
      ],
      correctAnswer: 1,
      explanation: 'Mixed Conditional (if + past perfect, would + have + past participle) geçmişteki bir durumun şimdiki sonucunu ifade eder.',
    },
    {
      level: 'C1',
      category: 'Inversion',
      question: 'Select the correct inverted form: "Never have I seen such beauty."',
      options: [
        'Never I have seen such beauty.',
        'I have never seen such beauty.',
        'I never have seen such beauty.',
        'Have I never seen such beauty.',
      ],
      correctAnswer: 0,
      explanation: 'Negative adverb başa geldiğinde özne ve yardımcı fiil yer değiştirir.',
    },
  ],

  es: [
    {
      level: 'A1',
      category: 'Presente Simple',
      question: '¿Qué oración es correcta?',
      options: [
        'Yo leyendo un libro ahora.',
        'Yo estoy leyendo un libro ahora.',
        'Yo leo un libro ahora.',
        'Yo lee un libro ahora.',
      ],
      correctAnswer: 1,
      explanation: 'El presente continuo (estar + gerundio) se usa para acciones que ocurren ahora.',
    }
  ],
  fr: [
    {
      level: 'A1',
      category: 'Présent Simple',
      question: 'Quelle phrase est correcte ?',
      options: [
        'Je lisant un livre maintenant.',
        'Je suis en train de lire un livre.',
        'Je lis un livre maintenant.',
        'Je lit un livre maintenant.',
      ],
      correctAnswer: 1,
      explanation: 'Le présent continu (être en train de + infinitif) est utilisé pour les actions en cours.',
    }
  ],
  de: [
    {
      level: 'A1',
      category: 'Präsens',
      question: 'Welcher Satz ist richtig?',
      options: [
        'Ich lesend ein Buch jetzt.',
        'Ich lese gerade ein Buch.',
        'Ich lese ein Buch jetzt.',
        'Ich liest ein Buch jetzt.',
      ],
      correctAnswer: 1,
      explanation: 'Das Präsens mit "gerade" wird für aktuelle Handlungen verwendet.',
    }
  ]
};
  const loadCharacterData = async () => {
    try {
      const characterData = await AsyncStorage.getItem('@character_data');
      if (characterData) {
        const loadedCharacter = JSON.parse(characterData);
        if (loadedCharacter.language && loadedCharacter.language.id) {
          setSelectedLanguage(loadedCharacter.language.id);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading character data:', error);
      Alert.alert('Hata', 'Karakter bilgileri yüklenemedi');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacterData();
  }, []);

  const handleAnswer = (index: number) => {
    if (!grammarQuestions[selectedLanguage]) return;

    setSelectedAnswer(index);
    const currentQ = grammarQuestions[selectedLanguage][currentQuestion];

    if (index === currentQ.correctAnswer) {
      setScore((prevScore) => prevScore + 10);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    if (!grammarQuestions[selectedLanguage]) return;

    setCurrentQuestion((prev) => {
      // Eğer son sorudaysanız, tekrar başa dönün
      const nextIndex = prev + 1;
      return nextIndex >= grammarQuestions[selectedLanguage].length ? 0 : nextIndex;
    });
    setShowExplanation(false);
    setSelectedAnswer(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <GameHeader title="Gramer Kanyonu" score={score} icon="format-text" />

          <View style={styles.questionCard}>            <Text style={styles.questionText}>
              {grammarQuestions[selectedLanguage]?.[currentQuestion]?.question || 'Loading...'}
            </Text>          <View style={styles.optionsContainer}>
            {grammarQuestions[selectedLanguage]?.[currentQuestion]?.options.map((option, index) => (
              <Pressable
                key={index}
                style={[
                  styles.option,
                  selectedAnswer === index && styles.selectedOption,
                  showExplanation && index === grammarQuestions[selectedLanguage]?.[currentQuestion]?.correctAnswer && styles.correctOption,
                  showExplanation && selectedAnswer === index && selectedAnswer !== grammarQuestions[selectedLanguage]?.[currentQuestion]?.correctAnswer && styles.wrongOption,
                ]}
                onPress={() => !showExplanation && handleAnswer(index)}
              >
                <Text style={[
                  styles.optionText,
                  showExplanation && index === grammarQuestions[selectedLanguage]?.[currentQuestion]?.correctAnswer && styles.correctOptionText,
                ]}>
                  {option}
                </Text>
              </Pressable>
            ))}
            </View>           {showExplanation && grammarQuestions[selectedLanguage]?.[currentQuestion] && (
  <View style={styles.explanationCard}>
    <Text style={styles.explanationText}>
      {grammarQuestions[selectedLanguage][currentQuestion].explanation}
    </Text>
    <Pressable style={styles.nextButton} onPress={nextQuestion}>
      <Text style={styles.nextButtonText}>Sonraki Soru</Text>
    </Pressable>
  </View>
)}

          </View>
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
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderColor: '#2196F3',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderColor: '#F44336',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
  },
  correctOptionText: {
    fontWeight: 'bold',
  },
  explanationCard: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
  },
  explanationText: {
    color: '#E1BEE7',
    fontSize: 16,
    marginBottom: 15,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});