// Jest setup for React Native mocks
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Silence NativeAnimatedHelper warnings
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock vector icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
