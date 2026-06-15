import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface AppBrandLogoProps {
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'splash';
}

export function AppBrandLogo({ size = 'medium' }: AppBrandLogoProps) {
  const dimension = getDimension(size);

  return (
    <View
      style={[
        styles.logoWrap,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension * 0.28
        }
      ]}
    >
      <Image
        source={require('../../assets/brand/logo.png')}
        style={{
          width: dimension,
          height: dimension
        }}
        resizeMode="contain"
      />
    </View>
  );
}

function getDimension(size: AppBrandLogoProps['size']) {
  if (size === 'tiny') return 38;
  if (size === 'small') return 48;
  if (size === 'medium') return 58;
  if (size === 'large') return 118;
  if (size === 'splash') return 154;

  return 58;
}

const styles = StyleSheet.create({
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible'
  }
});