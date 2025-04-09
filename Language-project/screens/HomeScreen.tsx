import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const wordLists = [
    { 
      id: 1, 
      title: 'Günlük Konuşma', 
      description: 'Günlük hayatta sık kullanılan kelimeler',
      words: 50, 
      progress: 75,
      lastStudied: '2 saat önce',
      category: 'Temel'
    },
    { 
      id: 2, 
      title: 'İş İngilizcesi', 
      description: 'İş hayatında kullanılan terimler',
      words: 30, 
      progress: 40,
      lastStudied: '1 gün önce',
      category: 'İş'
    },
    { 
      id: 3, 
      title: 'Seyahat Terimleri', 
      description: 'Seyahatlerde işinize yarayacak kelimeler',
      words: 25, 
      progress: 20,
      lastStudied: '3 gün önce',
      category: 'Seyahat'
    },
  ];

  const filteredLists = wordLists.filter(list =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hoş Geldiniz 👋</Text>
          <Text style={styles.headerTitle}>Kelime Listelerim</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5 name="search" size={16} color="#8D99AE" />
        <TextInput
          style={styles.searchInput}
          placeholder="Liste ara..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8D99AE"
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statValue}>{wordLists.reduce((acc, list) => acc + list.words, 0)}</Text>
            <Text style={styles.statLabel}>Toplam Kelime</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#F5E8FF' }]}>
            <Text style={styles.statValue}>
              {Math.round(wordLists.reduce((acc, list) => acc + list.progress, 0) / wordLists.length)}%
            </Text>
            <Text style={styles.statLabel}>Ortalama İlerleme</Text>
          </View>
        </View>

        <View style={styles.listsHeader}>
          <Text style={styles.sectionTitle}>Tüm Listeler</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('CreateList')}
          >
            <FontAwesome5 name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Yeni Liste</Text>
          </TouchableOpacity>
        </View>

        {filteredLists.map(list => (
          <TouchableOpacity 
            key={list.id}
            style={styles.listCard}
            onPress={() => navigation.navigate('ListDetail', { listId: list.id })}
          >
            <View style={styles.listHeader}>
              <View>
                <Text style={styles.listTitle}>{list.title}</Text>
                <Text style={styles.listDescription}>{list.description}</Text>
              </View>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{list.category}</Text>
              </View>
            </View>

            <View style={styles.listInfo}>
              <View style={styles.infoItem}>
                <FontAwesome5 name="book" size={14} color="#8D99AE" />
                <Text style={styles.infoText}>{list.words} kelime</Text>
              </View>
              <View style={styles.infoItem}>
                <FontAwesome5 name="clock" size={14} color="#8D99AE" />
                <Text style={styles.infoText}>{list.lastStudied}</Text>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${list.progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>%{list.progress}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <FontAwesome5 name="list" size={20} color="#2B2D42" />
          <Text style={[styles.tabText, styles.activeTabText]}>Listeler</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Search')}
        >
          <FontAwesome5 name="search" size={20} color="#8D99AE" />
          <Text style={styles.tabText}>Ara</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <FontAwesome5 name="user" size={20} color="#8D99AE" />
          <Text style={styles.tabText}>Profil</Text>
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
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8D99AE',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 20,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2B2D42',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 15,
  },
  statCard: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8D99AE',
  },
  listsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2B2D42',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B2D42',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2B2D42',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 14,
    color: '#8D99AE',
    width: Dimensions.get('window').width - 140,
  },
  categoryTag: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#2B2D42',
    fontWeight: '500',
  },
  listInfo: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#8D99AE',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F8F9FA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    width: 45,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#2B2D42',
    marginTop: -11,
    paddingTop: 9,
  },
  tabText: {
    fontSize: 12,
    color: '#8D99AE',
  },
  activeTabText: {
    color: '#2B2D42',
    fontWeight: 'bold',
  },
});