import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function ForgotPasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);  const handleResetPassword = async () => {
    if (!email) {
      toast.error('Lütfen e-posta adresinizi girin');
      return;
    }

    try {
      const users = await AsyncStorage.getItem('@users');
      const parsedUsers = users ? JSON.parse(users) : [];
      
      const user = parsedUsers.find(u => u.email === email);

      if (!user) {
        toast.error('Bu email adresiyle kayıtlı kullanıcı bulunamadı');
        return;
      }

      // Yeni rastgele şifre oluştur
      const newPassword = Math.random().toString(36).slice(-8);
      
      // Kullanıcının şifresini güncelle
      const updatedUsers = parsedUsers.map(u => {
        if (u.email === email) {
          return { ...u, password: newPassword };
        }
        return u;
      });

      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
      
      // Normalde burada email gönderme API'si çağrılır
      // Şimdilik şifreyi alert ile gösterelim
      setIsSent(true);
      toast.success('Yeni şifreniz: ' + newPassword);
    } catch (error) {
      toast.error('Şifre sıfırlama işlemi başarısız oldu');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>      <LinearGradient colors={['#1A1A1A', '#2D2D2D', '#3D3D3D']} style={styles.background}>
        <View style={styles.content}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </Pressable>

          <Text style={styles.title}>Şifremi Unuttum</Text>
          <Text style={styles.subtitle}>
            {isSent
              ? 'E-posta adresinize şifre sıfırlama bağlantısı gönderdik.'
              : 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.'}
          </Text>

          {!isSent && (
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

              <Pressable style={styles.resetButton} onPress={handleResetPassword}>
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Şifremi Sıfırla</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {isSent && (
            <Pressable
              style={styles.loginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Giriş sayfasına dön</Text>
            </Pressable>
          )}
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  },
  subtitle: {
    fontSize: 18,
    color: '#E1BEE7',
    textAlign: 'center',
    marginBottom: 40,
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
  resetButton: {
    borderRadius: 25,
    overflow: 'hidden',
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
  loginButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});