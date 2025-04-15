import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  useEffect(() => {
    // İlk kullanıcıyı oluştur
    const createInitialUser = async () => {
      try {
        const users = await AsyncStorage.getItem('@users');
        if (!users) {
          const initialUser = [{
            id: 'example123',
            email: 'test@example.com',
            password: '123456',
            username: 'test',
            createdAt: new Date().toISOString()
          }];
          await AsyncStorage.setItem('@users', JSON.stringify(initialUser));
        }
      } catch (error) {
        console.error('Error creating initial user:', error);
      }
    };

    createInitialUser();
    
    // Örnek kullanıcı bilgilerini göster
    Alert.alert(
      'Örnek Kullanıcı',
      'Email: test@example.com\nŞifre: 123456',
      [{ text: 'Tamam' }]
    );
  }, []);  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      const users = await AsyncStorage.getItem('@users');
      let parsedUsers = [];
      
      if (users) {
        parsedUsers = JSON.parse(users);
      } else {
        // Eğer hiç kullanıcı yoksa, örnek kullanıcıyı oluştur
        parsedUsers = [{
          id: 'example123',
          email: 'test@example.com',
          password: '123456',
          username: 'test',
          createdAt: new Date().toISOString()
        }];
        await AsyncStorage.setItem('@users', JSON.stringify(parsedUsers));
      }

      const user = parsedUsers.find(u => u.email === email && u.password === password);

      if (user) {
        await AsyncStorage.setItem('@current_user', JSON.stringify(user));
        Alert.alert('Başarılı', 'Giriş başarılı!');
        navigation.replace('CharacterCreation');
      } else {
        Alert.alert('Hata', 'Email veya şifre hatalı!');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu.');
    }
  };

  const handleSocialLogin = async (platform) => {
    try {
      let userData;
      switch (platform) {
        case 'Google':
          userData = {
            id: 'google_' + Math.random().toString(36).substring(2),
            email: `user${Math.floor(Math.random() * 1000)}@gmail.com`,
            name: 'Google User',
          };
          break;
        case 'Facebook':
          userData = {
            id: 'fb_' + Math.random().toString(36).substring(2),
            email: `user${Math.floor(Math.random() * 1000)}@facebook.com`,
            name: 'Facebook User',
          };
          break;
        case 'Twitter':
          userData = {
            id: 'twitter_' + Math.random().toString(36).substring(2),
            email: `user${Math.floor(Math.random() * 1000)}@twitter.com`,
            name: 'Twitter User',
          };
          break;
      }

      await AsyncStorage.setItem('@current_user', JSON.stringify(userData));
      Alert.alert('Başarılı', `${platform} ile giriş başarılı!`);
      navigation.replace('CharacterCreation');
    } catch (error) {
      Alert.alert('Hata', `${platform} ile giriş yapılamadı.`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>        <View style={styles.content}>          <View style={styles.logoContainer}>
            <Image 
              source={{
                uri: 'https://api.a0.dev/assets/image?text=cute%20robot%20mascot%20chibi%20style%20for%20language%20learning%20app&aspect=1:1'
              }}
              style={styles.robotImage}
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>LingoVerse</Text>
              <Text style={styles.subtitle}>Dil Öğrenme Macerasına Hoş Geldiniz!</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={24} color="#E1BEE7" />
              <TextInput
                style={styles.input}
                placeholder="E-posta"
                placeholderTextColor="#9E9E9E"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock" size={24} color="#E1BEE7" />
              <TextInput
                style={styles.input}
                placeholder="Şifre"
                placeholderTextColor="#9E9E9E"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
            </Pressable>

            <Pressable style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Giriş Yap</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <Pressable style={[styles.socialButton, { backgroundColor: '#4267B2' }]} onPress={() => handleSocialLogin('Facebook')}>
                <MaterialCommunityIcons name="facebook" size={24} color="white" />
              </Pressable>

              <Pressable style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]} onPress={() => handleSocialLogin('Twitter')}>
                <MaterialCommunityIcons name="twitter" size={24} color="white" />
              </Pressable>

              <Pressable style={[styles.socialButton, { backgroundColor: '#DB4437' }]} onPress={() => handleSocialLogin('Google')}>
                <MaterialCommunityIcons name="google" size={24} color="white" />
              </Pressable>
            </View>

            <Pressable style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                Hesabınız yok mu? <Text style={styles.registerLink}>Kayıt Ol</Text>
              </Text>
            </Pressable>
          </View>
        </View>
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
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  robotImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3', // Mavi
    textShadowColor: '#1976D2', // Koyu mavi gölge
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textDecorationLine: 'none',
    elevation: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#E1BEE7',
    marginTop: 5,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    paddingVertical: 15,
    marginLeft: 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#E1BEE7',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    color: '#E1BEE7',
    marginHorizontal: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    alignItems: 'center',
  },
  registerText: {
    color: '#E1BEE7',
    fontSize: 14,
  },
  registerLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});