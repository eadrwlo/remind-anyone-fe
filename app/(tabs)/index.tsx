import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import api from '@/services/api';

interface Reminder {
  id: number;
  title: string;
  description?: string;
  due_date: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Created' | 'Completed';
  creator_id: number;
  recipient_id: number;
}

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const { user } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reminders/');
      setReminders(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'received') return r.recipient_id === user?.id;
    return r.creator_id === user?.id;
  });

  const markCompleted = async (id: number) => {
    try {
      await api.put(`/reminders/${id}`, { status: 'Completed' });
      fetchReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReminder = async (id: number) => {
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText type="defaultSemiBold" style={styles.title}>{item.title}</ThemedText>
        <ThemedText style={[styles.severity, { color: getSeverityColor(item.severity) }]}>
          {item.severity}
        </ThemedText>
      </View>

      {item.description && <ThemedText style={styles.desc}>{item.description}</ThemedText>}

      <ThemedText style={styles.date}>Due: {new Date(item.due_date).toLocaleString()}</ThemedText>

      <View style={styles.actions}>
        <ThemedText style={styles.status}>{item.status}</ThemedText>

        {activeTab === 'received' && item.status !== 'Completed' && (
          <TouchableOpacity onPress={() => markCompleted(item.id)} style={styles.actionBtn}>
            <IconSymbol name="checkmark.circle" size={24} color="green" />
          </TouchableOpacity>
        )}

        {activeTab === 'sent' && (
          <TouchableOpacity onPress={() => deleteReminder(item.id)} style={styles.actionBtn}>
            <IconSymbol name="trash" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}>
          <ThemedText style={activeTab === 'received' ? styles.activeTabText : undefined}>Incoming</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}>
          <ThemedText style={activeTab === 'sent' ? styles.activeTabText : undefined}>Outgoing</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredReminders}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchReminders} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText style={styles.empty}>No reminders found.</ThemedText>}
        extraData={activeTab} // ensure re-render on tab switch
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        onPress={() => router.push('/reminders/create')}
      >
        <IconSymbol name="plus" size={30} color={colorScheme === 'dark' ? 'black' : 'white'} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'High': return 'red';
    case 'Medium': return 'orange';
    case 'Low': return 'green';
    default: return 'gray';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 5,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  activeTabText: {
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  list: {
    padding: 20,
    paddingBottom: 80, // for FAB
  },
  card: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    flex: 1,
  },
  severity: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  desc: {
    marginBottom: 5,
    fontSize: 14,
    opacity: 0.8,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  actionBtn: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    opacity: 0.5,
  }
});
