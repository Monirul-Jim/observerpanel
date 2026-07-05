import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { CalendarPicker } from './CalendarPicker';

interface DateFieldModalProps {
  visible: boolean;
  title: string;
  value: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export function DateFieldModal({ visible, title, value, onSelect, onClose }: DateFieldModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 }}
        onPress={onClose}
      >
        <View
          className="w-full max-w-[340px] rounded-2xl bg-white p-4 dark:bg-slate-800"
          style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 12 }}
        >
          <Text className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{title}</Text>

          <CalendarPicker
            value={value}
            onSelect={(date) => {
              onSelect(date);
              onClose();
            }}
          />

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="mt-3 items-center rounded-xl bg-slate-100 py-2.5 dark:bg-slate-700"
          >
            <Text className="text-[13px] font-bold text-slate-600 dark:text-slate-300">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
