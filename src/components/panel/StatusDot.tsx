import { View } from 'react-native';

export function StatusDot({ active }: { active: boolean }) {
  return (
    <View
      style={{
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: active ? '#22c55e' : '#94a3b8',
        marginRight: 5,
      }}
    />
  );
}
