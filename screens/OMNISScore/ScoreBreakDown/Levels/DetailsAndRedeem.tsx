import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import GlobalStyles from '../../../../assets/constants/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function toggleExpand(
  setExpandedPoints: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  throw new Error('Function not implemented.');
}


export default function DetailsAndRedeem() {
  return (
    <View
    style={{
      justifyContent: 'space-between',
      width: '80%',
      height: 40,
      alignSelf: 'center',
      flexDirection: 'row',
    }}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(
            LayoutAnimation.Presets.easeInEaseOut,
          );
          setExpanded(!expanded);
          // handleStateOneClick;
          // handleStateTwoClick;
        }}
        style={{
          borderColor: GlobalStyles.Colors.primary210,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 20,
          borderWidth: 1,
        }}>
        <Text style={{fontFamily: 'Futura', fontSize: 12}}>Details</Text>
      </TouchableOpacity>
    </View>

    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 0,
        marginBottom: 10,
      }}>
      <TouchableOpacity
        onPress={() => toggleExpand(setExpandedPoints)}
        style={styles.btn}>
        <View style={styles.MaterialCommunityIconsTextContainer}>
          <Text style={styles.btnText}>Redeem Points</Text>
          <MaterialCommunityIcons
            name="star-four-points-outline"
            size={10}
            color={GlobalStyles.Colors.primary200}
          />
        </View>
      </TouchableOpacity>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
    btn: {
      borderColor: GlobalStyles.Colors.primary210,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      borderWidth: 1,
    },
    btnText: {
      fontFamily: 'Futura',
      fontSize: 12,
      marginRight: 5,
    },
    MaterialCommunityIconsTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });