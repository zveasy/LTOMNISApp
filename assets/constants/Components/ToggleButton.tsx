import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import GlobalStyles from '../colors';

interface ToggleButtonProps {
  title: string;
  toggleTexts: [string, string];
  onToggle?: (activeText: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  title,
  toggleTexts,
  onToggle,
}) => {
  const [activeText, setActiveText] = useState<string>(toggleTexts[0]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);
  const [bottomSheetContent, setBottomSheetContent] = useState<string>('');

  const handleToggle = (newActiveText: string) => {
    setActiveText(newActiveText);
    onToggle && onToggle(newActiveText);
  };

  const handleIconPress = () => {
    setBottomSheetContent(
      activeText === toggleTexts[0]
        ? 'Content for option 1'
        : 'Content for option 2',
    );
    setBottomSheetVisible(true);
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
  };

  return (
    <View style={styles.customComponentContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <TouchableOpacity onPress={handleIconPress}>
          <Icon
            name="exclamationcircleo"
            size={15}
            color={GlobalStyles.Colors.accent100}
            style={{marginLeft: 5}}
          />
        </TouchableOpacity>
        {bottomSheetVisible && (
          <BottomSheet
            content={bottomSheetContent}
            onClose={handleBottomSheetClose}
          />
        )}
      </View>
      <View style={styles.toggleButtonContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.leftToggleButton,
            activeText === toggleTexts[0] && styles.activeToggleButton,
          ]}
          onPress={() => handleToggle(toggleTexts[0])}>
          <Text style={styles.toggleButtonText}>{toggleTexts[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            styles.rightToggleButton,
            activeText === toggleTexts[1] && styles.activeToggleButton,
          ]}
          onPress={() => handleToggle(toggleTexts[1])}>
          <Text style={styles.toggleButtonText}>{toggleTexts[1]}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BottomSheet: React.FC<{content: string; onClose: () => void}> = ({
  content,
  onClose,
}) => {
  return (
    <View style={styles.bottomSheetContainer}>
      <Text>{content}</Text>
      <Button title="Close" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  customComponentContainer: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleText: {
    color: GlobalStyles.Colors.accent100,
    fontSize: 13,
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    borderColor: GlobalStyles.Colors.primary200,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.Colors.accent116,
  },
  leftToggleButton: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightColor: GlobalStyles.Colors.primary200,
    borderRightWidth: 0.5,
  },
  rightToggleButton: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  activeToggleButton: {
    backgroundColor: GlobalStyles.Colors.primary200,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  
});

export default ToggleButton;
