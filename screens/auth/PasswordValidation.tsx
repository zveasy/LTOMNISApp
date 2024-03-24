import React, {useState} from 'react';
import {View, Text, TextInput, Button, Alert} from 'react-native';

export default function PasswordValidation() {
  const [password, setPassword] = useState('');

  const handlePasswordChange = (newPassword: React.SetStateAction<string>) => {
    setPassword(newPassword);
  };

  const handlePasswordSubmit = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Password Validation',
        'Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 symbol.',
      );
    } else {
      Alert.alert('Password Valid', 'Password meets the requirements.');
    }
  };

  const handleForgotPassword = () => {
    // Implement your "Forgot Password?" functionality here
    Alert.alert(
      'Forgot Password',
      'Implement the forgot password functionality.',
    );
  };

  return (
    <View style={{padding: 20}}>
      <Text>Password</Text>
      <TextInput
        style={{borderWidth: 1, padding: 10, marginBottom: 10}}
        value={password}
        onChangeText={handlePasswordChange}
        secureTextEntry
      />
      <Button title="Check Password" onPress={handlePasswordSubmit} />
      <Button title="Forgot Password?" onPress={handleForgotPassword} />
    </View>
  );
}
