import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('lists'); // 'lists' or 'words'

  const lists = [
    { id: 1, title: 'Günlük Konuşma', wordCount: 50 },
    { id: 2, title: 'İş İngilizcesi', wordCount: 30 },
    { id: 3, title: 'Seyahat Terimleri', wordCount: 25 },
  ];

  const words = [
    { id: 1, word: 'meeting', meaning: 'toplantı', list: 'İş İngilizcesi' },
    { id: 2, word: 'schedule', meaning: 'program', list: 'İş İngilizcesi' },
    { id: 3, word: 'deadline', meaning: 'son teslim tarihi', list: 'İş İngilizcesi' },
  ];

  const filteredLists = lists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWords = words.filter(word =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderList = ({ item }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => navigation.navigate('ListDetail', { listId: item.id })}
    >
      <View>
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listInfo}>{item.wordCount} kelime</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={20} color="#8D99AE" />
    </TouchableOpacity>
  );

  const renderWord = ({ item }) => (
    <View style={styles.wordItem}>
      <View>
        <Text style={styles.wordText}>{item.word}</Text>
        <Text style={styles.meaningText}>{item.meaning}</Text>
        <Text style={styles.listName}>{item.list}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#2B2D42" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ara</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="#8D99AE" />
        <TextInput
          style={styles.searchInput}
          placeholder="Liste veya kelime ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'lists' && styles.activeTab]}
          onPress={() => setActiveTab('lists')}
        >
          <Text style={[styles.tabText, activeTab === 'lists' && styles.activeTabText]}>
            Listeler
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'words' && styles.activeTab]}
          onPress={() => setActiveTab('words')}
        >
          <Text style={[styles.tabText, activeTab === 'words' && styles.activeTabText]}>
            Kelimeler
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'lists' ? (
        <FlatList
          data={filteredLists}
          renderItem={renderList}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <FlatList
          data={filteredWords}
          renderItem={renderWord}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 20,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2B2D42',
  },
  tabText: {
    fontSize: 16,
    color: '#8D99AE',
  },
  activeTabText: {
    color: '#2B2D42',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B2D42',
    marginBottom: 5,
  },
  listInfo: {
    fontSize: 14,
    color: '#8D99AE',
  },
  wordItem: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2D42',
    marginBottom: 5,
  },
  meaningText: {
    fontSize: 16,
    color: '#8D99AE',
    marginBottom: 5,
  },
  listName: {
    fontSize: 14,
    color: '#4CAF50',
  },
});