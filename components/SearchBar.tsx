import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Search, Mic } from 'lucide-react-native';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onVoicePress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Find a story...',
  onSearch,
  onVoicePress,
}) => {
  const [query, setQuery] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  const handleChangeText = (text: string) => {
    setQuery(text);
    onSearch?.(text);
  };

  return (
    <View className="px-6 mb-6">
      <View
        className={`flex-row items-center bg-white rounded-3xl shadow-sm border-2 ${
          isFocused ? 'border-purple-300 bg-purple-50' : 'border-transparent'
        }`}
      >
        <View className="pl-4">
          <Search size={20} color={isFocused ? '#a855f7' : '#9ca3af'} />
        </View>

        <TextInput
          className="flex-1 py-4 px-3 text-slate-700 text-sm font-medium"
          placeholder={placeholder}
          placeholderTextColor="#94a3b8"
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />

        <Pressable
          onPress={onVoicePress}
          className="mr-3 bg-purple-100 p-2 rounded-xl active:scale-95"
        >
          <Mic size={16} color="#9333ea" />
        </Pressable>
      </View>
    </View>
  );
};
