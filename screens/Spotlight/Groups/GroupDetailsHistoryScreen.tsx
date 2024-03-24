import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React from 'react';
import ScreenTitle from '../../../assets/constants/Components/ScreenTitle';
import GroupDetailsInfo from '../../../assets/constants/Components/GroupDetailsInfo';
import CompleteButton from '../../../assets/constants/Components/Buttons/CompleteButton';
import GlobalStyles from '../../../assets/constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SpotlightStackParamList } from '../../../App';

export default function GroupDetailsHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SpotlightStackParamList>>();

  return (
    <View style={styles.Background}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW5lcmd5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        }}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.titleContainer}>
          <ScreenTitle
            title="Group details"
            showBackArrow={true}
            onBackPress={() => {
              // Handle the back button press, e.g., navigate back
            }}
            showRightIcon={true}
            rightIconType="MaterialCommunityIcons" // Either 'Ionicons' or 'Feather'
            rightIconName="bell-plus-outline" // replace with actual Feather icon name
            onRightIconPress={() => {}}
          />
        </View>
        {/* The rest of your component goes here, inside the ImageBackground component */}
      </ImageBackground>
      <View
        style={{
          width: '100%',
          height: '70%',
          bottom: 0,
          position: 'absolute',
        }}>
        <GroupDetailsInfo />
      </View>
      <CompleteButton
        text="View payment status"
        color={GlobalStyles.Colors.primary200}
        onPress={() => navigation.navigate('PaymentStatus')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Background: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    marginTop: 60, // Adjust the margin to position the title appropriately
  },
});
