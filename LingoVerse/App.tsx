
  import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"

import HomeScreen from "./screens/HomeScreen"
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import VocabularyKingdom from './screens/VocabularyKingdom';
import GrammarCanyon from './screens/GrammarCanyon';
import SoundValley from './screens/SoundValley';
import LoginScreen from './screens/LoginScreen'; 
import SettingsScreen from './screens/SettingsScreen'; 
import RegisterScreen from './screens/RegisterScreen'; 
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import CompetitionArena from './screens/CompetitionArena';

  const Stack = createNativeStackNavigator();  function RootStack() {
    return (      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
        <Stack.Screen name="VocabularyKingdom" component={VocabularyKingdom} />
        <Stack.Screen name="GrammarCanyon" component={GrammarCanyon} />
        <Stack.Screen name="SoundValley" component={SoundValley} />
        <Stack.Screen name="CompetitionArena" component={CompetitionArena} />
      </Stack.Navigator>
    );
  }
  
  export default function App() {
    return (
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      userSelect: "none"
    }
  });
