import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {launchCamera, Asset} from 'react-native-image-picker';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

type VerificationResult = 'idle' | 'pending' | 'matched' | 'failed';

export default function SelfieVerification() {
  const [selfie, setSelfie] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult>('idle');

  const token = useSelector((state: AppState) => state.token);

  const takeSelfie = () => {
    launchCamera(
      {mediaType: 'photo', cameraType: 'front', quality: 0.8},
      response => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert(
            'Error',
            response.errorMessage || 'Failed to open camera',
          );
          return;
        }
        if (response.assets && response.assets[0]) {
          setSelfie(response.assets[0]);
          setResult('idle');
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (!selfie) {
      Alert.alert('No Selfie', 'Please take a selfie before submitting.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('selfie', {
      uri: selfie.uri,
      type: selfie.type || 'image/jpeg',
      name: selfie.fileName || 'selfie.jpg',
    });

    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/identity/verify_selfie',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      setResult(response.data.status || 'pending');
      if (response.data.status === 'matched') {
        Alert.alert('Success', 'Selfie verification successful!');
      } else if (response.data.status === 'failed') {
        Alert.alert(
          'Verification Failed',
          'Your selfie did not match the ID photo. Please try again.',
        );
      } else {
        Alert.alert('Submitted', 'Your selfie is being reviewed.');
      }
    } catch (error) {
      console.error('Selfie verification error:', error);
      Alert.alert('Error', 'Failed to verify selfie. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    switch (result) {
      case 'matched':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'failed':
        return '#F44336';
      default:
        return 'transparent';
    }
  };

  const getResultText = () => {
    switch (result) {
      case 'matched':
        return 'Verified';
      case 'pending':
        return 'Pending Review';
      case 'failed':
        return 'Not Matched';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Selfie Verification" showBackArrow={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        <Text style={styles.instructionText}>
          Take a clear selfie to verify your identity. Make sure your face is
          well-lit and centered in the frame. This will be compared against your
          uploaded ID photo.
        </Text>

        {result !== 'idle' && (
          <View
            style={[styles.resultBadge, {backgroundColor: getResultColor()}]}>
            <Text style={styles.resultText}>{getResultText()}</Text>
          </View>
        )}

        <View style={styles.cameraPreview}>
          {selfie ? (
            <Image source={{uri: selfie.uri}} style={styles.selfieImage} />
          ) : (
            <View style={styles.placeholderContent}>
              <Ionicons
                name="person-circle-outline"
                size={80}
                color={GlobalStyles.Colors.accent100}
              />
              <Text style={styles.placeholderText}>No selfie taken</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.cameraButton} onPress={takeSelfie}>
          <Ionicons name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.cameraButtonText}>
            {selfie ? 'Retake Selfie' : 'Take Selfie'}
          </Text>
        </TouchableOpacity>

        {selfie && (
          <View style={styles.submitContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: 40,
  },
  instructionText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  resultBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cameraPreview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.accent100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: GlobalStyles.Colors.primary700,
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginTop: 12,
  },
  selfieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: GlobalStyles.Colors.primary600,
    height: 50,
    borderRadius: 16,
    marginBottom: 16,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 56,
    backgroundColor: GlobalStyles.Colors.primary200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
