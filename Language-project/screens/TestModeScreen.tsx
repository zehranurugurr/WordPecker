import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function TestModeScreen({ navigation, route }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  
  const words = route.params?.words || [];
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    if (words.length) {
      generateQuestion(currentIndex);
    }
  }, [currentIndex]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentIndex + 1) / words.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const generateQuestion = (index) => {
    const correct = words[index];
    const options = [correct.meaning];
    
    // Generate 3 wrong options
    while (options.length < 4) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      if (!options.includes(randomWord.meaning)) {
        options.push(randomWord.meaning);
      }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    setCurrentQuestion({
      word: correct.word,
      correct: correct.meaning,
      options: shuffledOptions,
    });
  };

  const handleAnswer = (answer) => {
    if (answer === currentQuestion.correct) {
      toast.success('Doğru!');
      setScore(score + 1);
    } else {
      toast.error('Yanlış!');
    }

    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (!words.length) {
    return (
      <View style={styles.container}>
        <Text>Kelime bulunmamaktadır.</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="times" size={24} color="#2B2D42" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Test Sonucu</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.resultScore}>
            {score} / {words.length}
          </Text>
          <Text style={styles.resultText}>
            {score === words.length ? 'Mükemmel!' : 'Biraz daha çalışmalısın!'}
          </Text>
          <TouchableOpacity 
            style={styles.restartButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.restartButtonText}>Testi Bitir</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="times" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Modu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>

      <View style={styles.questionContainer}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {words.length}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionWord}>{currentQuestion?.word}</Text>
          <Text style={styles.questionText}>Bu kelimenin anlamı nedir?</Text>
        </View>

        <View style={styles.options}>
          {currentQuestion?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A9D0F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  counter: {
    fontSize: 16,
    color: '#8D99AE',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  questionWord: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: '#8D99AE',
  },
  options: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    padding: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#2B2D42',
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    color: '#8D99AE',
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#2B2D42',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});