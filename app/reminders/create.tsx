import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/services/api';

interface Friend {
    id: number;
    username: string;
}

export default function CreateReminderScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(''); // Text input for now
    const [severity, setSeverity] = useState('Medium');
    const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);

    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // Set default due date to tomorrow, same time as now
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Format to YYYY-MM-DDTHH:mm based on LOCAL time
        // The trick: shift time by timezone offset, then use toISOString
        const offset = tomorrow.getTimezoneOffset() * 60000;
        const localDate = new Date(tomorrow.getTime() - offset);
        setDueDate(localDate.toISOString().slice(0, 16));

        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await api.get('/friends/');
            setFriends(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const createReminder = async () => {
        if (!title || !dueDate || !selectedFriendId) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            setLoading(true);
            await api.post('/reminders/', {
                title,
                description,
                due_date: new Date(dueDate).toISOString(),
                severity,
                recipient_id: selectedFriendId
            });
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.detail || 'Failed to create reminder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ScrollView>
                <ThemedText type="title" style={styles.header}>New Reminder</ThemedText>

                <ThemedText style={styles.label}>Title *</ThemedText>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Buy milk"
                />

                <ThemedText style={styles.label}>Description</ThemedText>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <ThemedText style={styles.label}>Due Date (YYYY-MM-DDTHH:mm) *</ThemedText>
                <TextInput
                    style={styles.input}
                    value={dueDate}
                    onChangeText={setDueDate}
                    placeholder="2023-01-01T12:00"
                />

                <ThemedText style={styles.label}>Severity</ThemedText>
                <View style={styles.severityContainer}>
                    {['Low', 'Medium', 'High'].map(s => (
                        <TouchableOpacity
                            key={s}
                            style={[styles.severityBtn, severity === s && styles.severityBtnActive, { borderColor: getSeverityColor(s) }]}
                            onPress={() => setSeverity(s)}
                        >
                            <ThemedText style={{ color: severity === s ? 'white' : getSeverityColor(s) }}>{s}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>

                <ThemedText style={styles.label}>Select Friend *</ThemedText>
                <View style={styles.friendsList}>
                    {friends.map(friend => (
                        <TouchableOpacity
                            key={friend.id}
                            style={[styles.friendItem, selectedFriendId === friend.id && styles.friendItemActive]}
                            onPress={() => setSelectedFriendId(friend.id)}
                        >
                            <ThemedText>{friend.username}</ThemedText>
                        </TouchableOpacity>
                    ))}
                    {friends.length === 0 && <ThemedText>No friends found. Add some first!</ThemedText>}
                </View>

                <View style={styles.spacer} />

                <Button title={loading ? "Creating..." : "Send Reminder"} onPress={createReminder} disabled={loading} />
            </ScrollView>
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
        padding: 20,
    },
    header: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: 'white',
    },
    severityContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
    },
    severityBtn: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,
        alignItems: 'center',
    },
    severityBtnActive: {
        backgroundColor: '#333', // will be overridden by logic if needed, but text color handled inline
        // actually let's use the color for bg
    },
    friendsList: {
        gap: 5,
        marginBottom: 20,
    },
    friendItem: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 5,
    },
    friendItemActive: {
        borderColor: '#0a7ea4',
        backgroundColor: 'rgba(10, 126, 164, 0.1)',
    },
    spacer: {
        height: 20,
    }
});
