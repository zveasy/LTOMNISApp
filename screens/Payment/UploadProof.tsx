import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import ScreenTitle from '../../assets/constants/Components/ScreenTitle';
import GlobalStyles from '../../assets/constants/colors';
import api from '../../services/api';

export default function UploadProof({route}: {route: any}) {
  const navigation = useNavigation<any>();
  const obligationId = route?.params?.obligationId;

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1200,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri ?? null);
        setImageName(asset.fileName ?? 'payment_proof.jpg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image of your payment proof.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('obligationId', obligationId);
      formData.append('notes', notes);
      formData.append('proof', {
        uri: imageUri,
        type: 'image/jpeg',
        name: imageName || 'payment_proof.jpg',
      } as any);

      await api.post('/payment/upload_proof', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error uploading proof:', error);
      Alert.alert('Error', 'Failed to upload proof. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.background}>
        <ScreenTitle title="Upload Payment Proof" showBackArrow />
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Icon
              name="checkmark"
              size={48}
              color={GlobalStyles.Colors.primary100}
            />
          </View>
          <Text style={styles.successTitle}>Proof Submitted!</Text>
          <Text style={styles.successText}>
            Your payment proof has been uploaded successfully. The lender will
            review and confirm receipt.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <ScreenTitle title="Upload Payment Proof" showBackArrow />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.card}>
          <View style={styles.instructionRow}>
            <Icon
              name="information-circle-outline"
              size={20}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.instructionText}>
              Upload a screenshot or photo of your payment confirmation.
              Accepted formats: JPG, PNG. This helps the lender verify your
              payment quickly.
            </Text>
          </View>
        </View>

        {/* Image Upload Area */}
        <TouchableOpacity
          style={[
            styles.uploadArea,
            imageUri ? styles.uploadAreaWithImage : null,
          ]}
          onPress={handleSelectImage}>
          {imageUri ? (
            <Image source={{uri: imageUri}} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Icon
                name="camera-outline"
                size={48}
                color={GlobalStyles.Colors.primary200}
              />
              <Text style={styles.uploadText}>Tap to select image</Text>
              <Text style={styles.uploadSubtext}>JPG or PNG, max 5MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={handleSelectImage}>
            <Icon
              name="refresh-outline"
              size={16}
              color={GlobalStyles.Colors.primary200}
            />
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        )}

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any notes about this payment (optional)"
            placeholderTextColor={GlobalStyles.Colors.accent110}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, submitting && {opacity: 0.6}]}
        onPress={handleSubmit}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={GlobalStyles.Colors.primary100} />
        ) : (
          <Text style={styles.primaryButtonText}>Submit Proof</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: GlobalStyles.Colors.primary800,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  cardTitle: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  uploadArea: {
    borderRadius: 16,
    marginTop: 16,
    borderWidth: 2,
    borderColor: 'rgba(189,174,141,0.3)',
    borderStyle: 'dashed',
    overflow: 'hidden',
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(189,174,141,0.05)',
  },
  uploadAreaWithImage: {
    borderStyle: 'solid',
    borderColor: GlobalStyles.Colors.primary200,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  uploadText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  uploadSubtext: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 12,
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  changeImageText: {
    color: GlobalStyles.Colors.primary200,
    fontSize: 14,
    marginLeft: 6,
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 14,
    color: GlobalStyles.Colors.primary100,
    fontSize: 14,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  primaryButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 30,
  },
  primaryButtonText: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 18,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GlobalStyles.Colors.primary400,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: GlobalStyles.Colors.primary100,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  successText: {
    color: GlobalStyles.Colors.accent110,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
