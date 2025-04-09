import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LearnModeScreen({ navigation, route }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const words = route.params?.words || [];

  useEffect(() => {
    Animated.timing(progress, {
      toValue: (currentIndex + 1) / words.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowMeaning(false);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowMeaning(false);
    }
  };

  if (!words.length) {
    return (
      <View style={styles.container}>
        <Text>Kelime bulunmamaktadır.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="times" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Öğrenme Modu</Text>
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

      <View style={styles.cardContainer}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {words.length}
        </Text>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => setShowMeaning(!showMeaning)}
        >
          <Text style={styles.word}>{words[currentIndex].word}</Text>
          {showMeaning && (
            <Text style={styles.meaning}>{words[currentIndex].meaning}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>Anlamı görmek için karta dokun</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Önceki</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.nextButton]}
          onPress={handleNext}
        >
          <Text style={styles.actionButtonText}>
            {currentIndex === words.length - 1 ? 'Bitir' : 'Sonraki'}
          </Text>
          <FontAwesome5 name="arrow-right" size={20} color="#fff" />
        </TouchableOpacity>
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  counter: {
    fontSize: 16,
    color: '#8D99AE',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 3/2,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 10,
  },
  meaning: {
    fontSize: 24,
    color: '#8D99AE',
  },
  hint: {
    marginTop: 20,
    fontSize: 16,
    color: '#8D99AE',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2B2D42',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});