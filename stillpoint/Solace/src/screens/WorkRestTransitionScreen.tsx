import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '@/constants/colors';
import { FONT } from '@/constants/typography';

export default function WorkRestTransitionScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.root}>
      <Text style={styles.text}>Work → Rest Transition</Text>
      <Text style={styles.sub}>Sprint 7 builds this screen</Text>
      <Pressable onPress={() => navigation.navigate('Home' as never)}>
        <Text style={styles.link}>← Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.restSlate,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  text: {
    fontFamily: FONT.thin,
    fontSize: 22,
    color: COLORS.cream,
    letterSpacing: 3,
  },
  sub: {
    fontFamily: FONT.light,
    fontSize: 13,
    color: COLORS.creamFaint,
  },
  link: {
    fontFamily: FONT.light,
    fontSize: 13,
    color: COLORS.creamFaint,
    marginTop: 24,
  },
});
