import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    if (!email || !password) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }
    // TODO: Implement actual authentication
    toast.success(isLogin ? 'Giriş başarılı!' : 'Kayıt başarılı!');
    navigation.replace('Main');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dil Öğren</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Hesabınıza giriş yapın' : 'Yeni hesap oluşturun'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
          <Text style={styles.mainButtonText}>
            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => toast.info('Google ile giriş yakında!')}
        >
          <FontAwesome name="google" size={20} color="#DB4437" />
          <Text style={styles.socialButtonText}>
            Google ile devam et
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#A9D0F5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2B2D42',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8D99AE',
  },
  form: {
    gap: 15,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  mainButton: {
    backgroundColor: '#2B2D42',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    gap: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#2B2D42',
  },
  switchText: {
    textAlign: 'center',
    color: '#2B2D42',
    marginTop: 20,
  },
});