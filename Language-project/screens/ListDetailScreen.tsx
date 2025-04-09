import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function ListDetailScreen({ navigation, route }) {
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [showAddWord, setShowAddWord] = useState(false);

  // Örnek kelimeler
  const [words, setWords] = useState([
    { id: 1, word: 'meeting', meaning: 'toplantı', learned: true },
    { id: 2, word: 'schedule', meaning: 'program', learned: false },
    { id: 3, word: 'deadline', meaning: 'son teslim tarihi', learned: false },
  ]);

  const handleAddWord = () => {
    if (!newWord || !newMeaning) {
      toast.error('Lütfen kelime ve anlamını girin');
      return;
    }

    setWords([
      ...words,
      {
        id: words.length + 1,
        word: newWord,
        meaning: newMeaning,
        learned: false,
      },
    ]);

    setNewWord('');
    setNewMeaning('');
    setShowAddWord(false);
    toast.success('Kelime başarıyla eklendi!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Liste Detayları</Text>
        <TouchableOpacity onPress={() => setShowAddWord(!showAddWord)}>
          <FontAwesome5 name="plus" size={24} color="#2B2D42" />
        </TouchableOpacity>
      </View>

      {showAddWord && (
        <View style={styles.addWordContainer}>
          <TextInput
            style={styles.input}
            value={newWord}
            onChangeText={setNewWord}
            placeholder="Yeni kelime"
          />
          <TextInput
            style={styles.input}
            value={newMeaning}
            onChangeText={setNewMeaning}
            placeholder="Anlamı"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddWord}>
            <Text style={styles.addButtonText}>Kelime Ekle</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('LearnMode', { words })}
        >
          <FontAwesome5 name="book-reader" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Öğren</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.testButton]}
          onPress={() => navigation.navigate('TestMode', { words })}
        >
          <FontAwesome5 name="tasks" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Test Et</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.wordList}>
        {words.map((item) => (
          <View key={item.id} style={styles.wordItem}>
            <View>
              <Text style={styles.word}>{item.word}</Text>
              <Text style={styles.meaning}>{item.meaning}</Text>
            </View>
            <FontAwesome5 
              name={item.learned ? "check-circle" : "circle"} 
              size={24} 
              color={item.learned ? "#4CAF50" : "#E9ECEF"}
            />
          </View>
        ))}
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  addWordContainer: {
    padding: 20,
    backgroundColor: '#F8F9FA',
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2B2D42',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  testButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordList: {
    padding: 20,
  },
  wordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 10,
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2D42',
  },
  meaning: {
    fontSize: 16,
    color: '#8D99AE',
    marginTop: 5,
  },
});