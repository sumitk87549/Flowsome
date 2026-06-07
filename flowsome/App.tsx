import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>LET'S TRY TO FUCK THINGS UP AND MAKE THE WORLD DO WORK!!!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    color: '#ffe137ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
