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
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import axios from 'axios';
import GlobalStyles from '../../assets/constants/colors';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import {AppState} from '../../ReduxStore';

type VerificationStatus = 'idle' | 'pending' | 'approved' | 'rejected';

export default function GovernmentIdUpload() {
  const [frontImage, setFrontImage] = useState<Asset | null>(null);
  const [backImage, setBackImage] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<VerificationStatus>('idle');

  const token = useSelector((state: AppState) => state.token);

  const pickImage = (side: 'front' | 'back') => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        if (side === 'front') {
          setFrontImage(response.assets[0]);
        } else {
          setBackImage(response.assets[0]);
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      Alert.alert(
        'Missing Images',
        'Please upload both front and back of your ID.',
      );
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('front', {
      uri: frontImage.uri,
      type: frontImage.type || 'image/jpeg',
      name: frontImage.fileName || 'front.jpg',
    });
    formData.append('back', {
      uri: backImage.uri,
      type: backImage.type || 'image/jpeg',
      name: backImage.fileName || 'back.jpg',
    });

    try {
      const response = await axios.post(
        'http://localhost:8080/api/omnis/identity/upload_document',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token.token}`,
          },
        },
      );
      setStatus(response.data.status || 'pending');
      Alert.alert('Success', 'Your ID has been submitted for review.');
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FFC107';
      case 'rejected':
        return '#F44336';
      default:
        return 'transparent';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Review';
      case 'rejected':
        return 'Rejected';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Identity Verification" showBackArrow={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        <Text style={styles.instructionText}>
          Please upload clear photos of the front and back of your
          government-issued ID (passport, driver's license, or national ID
          card).
        </Text>

        {status !== 'idle' && (
          <View
            style={[styles.statusBadge, {backgroundColor: getStatusColor()}]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        )}

        <Text style={styles.sectionLabel}>Front of ID</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickImage('front')}>
          {frontImage ? (
            <Image source={{uri: frontImage.uri}} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContent}>
              <Ionicons
                name="camera-outline"
                size={48}
                color={GlobalStyles.Colors.accent100}
              />
              <Text style={styles.uploadText}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Back of ID</Text>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickImage('back')}>
          {backImage ? (
            <Image source={{uri: backImage.uri}} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderContent}>
              <Ionicons
                name="camera-outline"
                size={48}
                color={GlobalStyles.Colors.accent100}
              />
              <Text style={styles.uploadText}>Tap to upload</Text>
            </View>
          )}
        </TouchableOpacity>

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
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionLabel: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  uploadBox: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.Colors.accent100,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  placeholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 14,
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
