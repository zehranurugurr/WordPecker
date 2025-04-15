import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Image, Alert, Modal, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();  const [character, setCharacter] = useState(null);
  const [unlockedLevels, setUnlockedLevels] = useState(['VocabularyKingdom']);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [notes, setNotes] = useState([]);
  const [showNotesHistory, setShowNotesHistory] = useState(false);

  const getCharacterImage = (language) => {
    const prompts = {
      en: 'british person cartoon style',
      es: 'spanish person cartoon style',
      fr: 'french person cartoon style',
      de: 'german person cartoon style'
    };
    return `https://api.a0.dev/assets/image?text=${prompts[language.id]}&aspect=1:1`;
  };

  const canAccessLevel = (levelName) => {
    return unlockedLevels.includes(levelName);
  };          const handleLevelPress = (levelName) => {
            navigation.navigate(levelName);
          };

          const goToCompetition = () => {
            navigation.navigate('CompetitionArena');
          };

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const characterData = await AsyncStorage.getItem('@character_data');
      if (characterData) {
        setCharacter(JSON.parse(characterData));
      }
    } catch (error) {
      console.error('Error loading character:', error);
    }
  };

  const handleResetCharacter = async () => {
    Alert.alert(
      'Karakteri Sıfırla',
      'Karakterinizi sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sıfırla',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@character_data');
              setCharacter(null);
            } catch (error) {
              Alert.alert('Hata', 'Karakter sıfırlanamadı. Lütfen tekrar deneyin.');
            }
          },
        },
      ]
    );
  };  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient        colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']}
        style={styles.background}
      >
        <View style={styles.aiAssistantContainer}>
          <Pressable style={styles.aiButton} onPress={() => setShowNoteModal(true)}>
            <Image
              source={{
                uri: 'https://api.a0.dev/assets/image?text=cute%20AI%20assistant%20robot%20chibi%20style&aspect=1:1'
              }}
              style={styles.aiImage}
            />
            <View style={styles.aiButtonTextContainer}>
              <Text style={styles.aiButtonText}>Not almak için tıkla!</Text>
            </View>
          </Pressable>
        </View>

        <Modal
          visible={showNoteModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNoteModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {showNotesHistory ? 'Notlarım' : 'Not Al'}
              </Text>
              
              {!showNotesHistory ? (
                <TextInput
                  style={styles.noteInput}
                  placeholder="Notunu buraya yaz..."
                  placeholderTextColor="#E1BEE7"
                  multiline
                  value={currentNote}
                  onChangeText={setCurrentNote}
                />
              ) : (
                <ScrollView style={styles.notesScroll}>
                  {notes.map((note, index) => (
                    <View key={index} style={styles.noteItem}>
                      <Text style={styles.noteText}>{note.text}</Text>
                      <Text style={styles.noteDate}>{note.date}</Text>
                    </View>
                  ))}
                </ScrollView>
              )}
              
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowNoteModal(false)}
                >
                  <Text style={styles.modalButtonText}>Kapat</Text>
                </Pressable>
                
                <Pressable
                  style={styles.modalButton}
                  onPress={() => {
                    if (!showNotesHistory && currentNote.trim()) {
                      const newNote = {
                        text: currentNote,
                        date: new Date().toLocaleString()
                      };
                      setNotes([...notes, newNote]);
                      setCurrentNote('');
                      setShowNotesHistory(true);
                    }
                    setShowNotesHistory(!showNotesHistory);
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    {showNotesHistory ? 'Not Al' : 'Kaydet'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>        <View style={styles.header}>
          <Text style={styles.title}>LingoVerse</Text>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog" size={24} color="white" />
          </Pressable>
          {character ? (
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{character.name}</Text>
              <Text style={styles.characterDetails}>
                {character.language.name} Öğreniyor • {character.style.name}
              </Text>
              <Pressable onPress={handleResetCharacter} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Karakteri Sıfırla</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={styles.subtitle}>Dil Krallığını Kurtar!</Text>
          )}
        </View>        <Pressable 
          style={styles.competitionButton}
          onPress={goToCompetition}
        >
          <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
          <Text style={styles.competitionText}>Yarışma Arenası</Text>
        </Pressable>        <View style={styles.gameMap}>
          <Image 
            source={{ uri: 'https://api.a0.dev/assets/image?text=mystical%20dark%20fantasy%20kingdom%20map%20with%20castles%20mountains%20and%20fog%20black%20and%20white&aspect=1:1' }}
            style={styles.mapImage}
          />
          <View style={styles.levelsContainer}>
            <Pressable 
              style={[styles.levelButton, canAccessLevel('VocabularyKingdom') ? styles.unlockedLevel : styles.lockedLevel]}
              onPress={() => handleLevelPress('VocabularyKingdom')}
            >
              <MaterialCommunityIcons 
                name={canAccessLevel('VocabularyKingdom') ? "book-open-variant" : "lock"} 
                size={32} 
                color="white" 
              />
              <Text style={styles.levelTitle}>Kelimeler Diyarı</Text>
              <Text style={styles.levelSubtitle}>Seviye 1</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.levelButton, canAccessLevel('GrammarCanyon') ? styles.unlockedLevel : styles.lockedLevel]}
              onPress={() => handleLevelPress('GrammarCanyon')}
            >
              <MaterialCommunityIcons 
                name={canAccessLevel('GrammarCanyon') ? "format-text" : "lock"} 
                size={32} 
                color="white" 
              />
              <Text style={styles.levelTitle}>Gramer Kanyonu</Text>
              <Text style={styles.levelSubtitle}>Seviye 2</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.levelButton, canAccessLevel('SoundValley') ? styles.unlockedLevel : styles.lockedLevel]}
              onPress={() => handleLevelPress('SoundValley')}
            >
              <MaterialCommunityIcons 
                name={canAccessLevel('SoundValley') ? "microphone" : "lock"} 
                size={32} 
                color="white" 
              />
              <Text style={styles.levelTitle}>Ses Vadisi</Text>
              <Text style={styles.levelSubtitle}>Seviye 3</Text>
            </Pressable>
          </View>
        </View>        <View style={styles.statsContainer}>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
              <Text style={styles.statText}>Seviye {character?.level || 1}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="diamond" size={24} color="#4FC3F7" />
              <Text style={styles.statText}>{character?.points || 0} Puan</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  aiAssistantContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 10,
  },
  aiImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  aiButtonTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 8,
    marginLeft: 10,
  },
  aiButtonText: {
    color: '#4A148C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#4A148C',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: 'white',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notesScroll: {
    maxHeight: 400,
    marginBottom: 20,
  },
  noteItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  noteDate: {
    color: '#E1BEE7',
    fontSize: 12,
  },
  competitionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    justifyContent: 'center',
  },
  competitionText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  characterInfo: {
    alignItems: 'center',
    marginTop: 10,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  characterDetails: {
    fontSize: 16,
    color: '#E1BEE7',
    marginTop: 5,
  },
  resetButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#E1BEE7',
    marginTop: 8,
  },  gameMap: {
    position: 'relative',
    height: 500,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.4,
    filter: 'grayscale(100%)',
  },
  levelsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
    gap: 20,
  },  levelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  unlockedLevel: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  lockedLevel: {
    backgroundColor: 'rgba(158, 158, 158, 0.3)',
    borderColor: '#9E9E9E',
    borderWidth: 1,
  },
  levelTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  levelSubtitle: {
    color: '#E1BEE7',
    fontSize: 16,
    marginTop: 5,
  },  statsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    marginBottom: 20,
    borderRadius: 15,
    padding: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  statText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
});