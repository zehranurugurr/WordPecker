import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder for API URL - this should be in .env files in real app
const API_URL = 'https://api.wordpecker.example.com';

// Define types
export interface WordList {
  id: string;
  name: string;
  description: string;
  context?: string;
  createdAt: string;
  wordCount?: number;
}

export interface Word {
  id: string;
  listId: string;
  value: string;
  meaning: string;
  createdAt: string;
}

export interface Exercise {
  wordId: string;
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  wordId: string;
  type: 'quiz';
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication token interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define API service with placeholder implementations
const apiService = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    // This would be implemented by the team
    console.log('Login API call - to be implemented');
    return { user: { id: '1', email, name: 'Test User', createdAt: new Date().toISOString() }, token: 'test-token' };
  },
  
  register: async (email: string, password: string, name: string) => {
    // This would be implemented by the team
    console.log('Register API call - to be implemented');
    return { user: { id: '1', email, name, createdAt: new Date().toISOString() }, token: 'test-token' };
  },
  
  // Lists endpoints
  getLists: async (): Promise<WordList[]> => {
    // This would be implemented by the team
    console.log('Get lists API call - to be implemented');
    return [
      { id: '1', name: 'Sample List', description: 'A sample list', createdAt: new Date().toISOString(), wordCount: 10 }
    ];
  },
  
  createList: async (list: { name: string; description: string; context?: string }): Promise<WordList> => {
    // This would be implemented by the team
    console.log('Create list API call - to be implemented');
    return { 
      id: Math.random().toString(36).substring(7), 
      ...list, 
      createdAt: new Date().toISOString() 
    };
  },
  
  // Words endpoints
  getWords: async (listId: string): Promise<Word[]> => {
    // This would be implemented by the team
    console.log('Get words API call - to be implemented');
    return [
      { id: '1', listId, value: 'sample', meaning: 'an example', createdAt: new Date().toISOString() }
    ];
  },
  
  addWord: async (word: { listId: string; value: string; meaning?: string }): Promise<Word> => {
    // This would be implemented by the team
    console.log('Add word API call - to be implemented');
    return { 
      id: Math.random().toString(36).substring(7), 
      ...word, 
      meaning: word.meaning || 'To be generated', 
      createdAt: new Date().toISOString() 
    };
  },
  
  // Learning endpoints
  startLearning: async (listId: string): Promise<{ exercises: Exercise[] }> => {
    // This would be implemented by the team
    console.log('Start learning API call - to be implemented');
    return { 
      exercises: [
        {
          wordId: '1',
          type: 'multiple_choice',
          question: 'What does "sample" mean?',
          options: ['an example', 'a test', 'a demonstration', 'a specimen'],
          correctAnswer: 'an example'
        }
      ] 
    };
  },
  
  // Quiz endpoints
  startQuiz: async (listId: string): Promise<{ questions: Quiz[] }> => {
    // This would be implemented by the team
    console.log('Start quiz API call - to be implemented');
    return { 
      questions: [
        {
          wordId: '1',
          type: 'quiz',
          question: 'Which of these is a "sample"?',
          options: ['A prototype', 'A final product', 'A manufacturing tool', 'A sales brochure'],
          correctAnswer: 'A prototype'
        }
      ] 
    };
  },
};

export default apiService;
