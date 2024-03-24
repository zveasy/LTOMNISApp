import {View, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import PostOfferHeader from './PostOfferHeader';

export default function PostOffer() {
  return (
    <View style={styles.Background}>
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW5lcmd5fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"></ImageBackground>
      <View
        style={{
          width: '100%',
          height: '70%',
          bottom: 0,
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: 24,
        }}>
        <PostOfferHeader
          avatar="https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFjZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
          firstname="John"
          lastname="Doe"
          number={80}
          title="Solar Panel"
          totalAmount={700}
          progress={200}
          participants={[
            {
              name: 'John Doe',
              avatarUri:
                'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZmFjZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            },
            {
              name: 'John Doe',
              avatarUri:
                'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
            },
            {name: 'John Doe', avatarUri: 'http://example.com/johndoe.png'},
            // ... other participants
          ]}
          subtext="This is some random wrapping text that will be there and be going everywhere"
          buttonText="Offer"
        />
      </View>
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
