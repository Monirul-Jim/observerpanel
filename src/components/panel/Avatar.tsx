import { View, Text, Image } from 'react-native';

interface AvatarProps {
  name: string;
  size?: number;
  color?: string;
  uri?: string | null;
}

export function Avatar({ name, size = 40, color = '#1e3a5f', uri }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.34 }}>
        {initials}
      </Text>
    </View>
  );
}
