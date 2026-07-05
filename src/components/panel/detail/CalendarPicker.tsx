import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CalendarPickerProps {
  value: string; // 'YYYY-MM-DD'
  onSelect: (date: string) => void;
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function CalendarPicker({ value, onSelect }: CalendarPickerProps) {
  const selected = parseISO(value);
  const [viewDate, setViewDate] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; date: Date; inMonth: boolean }[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    const day = daysInPrevMonth - firstWeekday + 1 + i;
    cells.push({ day, date: new Date(year, month - 1, day), inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, date: new Date(year, month, day), inMonth: true });
  }
  let nextDay = 1;
  while (cells.length < 42) {
    cells.push({ day: nextDay, date: new Date(year, month + 1, nextDay), inMonth: false });
    nextDay++;
  }

  return (
    <View>
      {/* Month nav */}
      <View className="mb-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => setViewDate(new Date(year, month - 1, 1))}
          hitSlop={8}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700"
        >
          <Text className="text-sm font-bold text-slate-600 dark:text-slate-300">‹</Text>
        </TouchableOpacity>
        <Text className="text-sm font-bold text-slate-900 dark:text-white">
          {MONTH_NAMES[month]} {year}
        </Text>
        <TouchableOpacity
          onPress={() => setViewDate(new Date(year, month + 1, 1))}
          hitSlop={8}
          activeOpacity={0.7}
          className="h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700"
        >
          <Text className="text-sm font-bold text-slate-600 dark:text-slate-300">›</Text>
        </TouchableOpacity>
      </View>

      {/* Weekday header */}
      <View className="flex-row">
        {WEEKDAYS.map((w, i) => (
          <View key={i} style={{ width: `${100 / 7}%` }} className="items-center py-1">
            <Text className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">{w}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="flex-row flex-wrap">
        {cells.map((cell, i) => {
          const isSelected = cell.inMonth && isSameDay(cell.date, selected);
          const isToday = cell.inMonth && isSameDay(cell.date, today);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => cell.inMonth && onSelect(toISO(cell.date))}
              disabled={!cell.inMonth}
              activeOpacity={0.7}
              style={{ width: `${100 / 7}%` }}
              className="items-center py-1"
            >
              <View
                className={`h-8 w-8 items-center justify-center rounded-full ${
                  isSelected ? 'bg-[#1e3a5f]' : isToday ? 'border border-[#1e3a5f]' : ''
                }`}
              >
                <Text
                  className={`text-[13px] ${
                    !cell.inMonth
                      ? 'text-slate-300 dark:text-slate-600'
                      : isSelected
                        ? 'font-bold text-white'
                        : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {cell.day}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
