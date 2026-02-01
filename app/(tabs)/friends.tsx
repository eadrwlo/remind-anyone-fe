import { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import api from '@/services/api';

interface Friend {
    id: number;
    email: string;
    username: string;
    full_name?: string;
}

export default function FriendsScreen() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [newFriendEmail, setNewFriendEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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

    const addFriend = async () => {
        if (!newFriendEmail) return;
        try {
            setLoading(true);
            await api.post('/friends/', { friend_email_or_username: newFriendEmail });
            Alert.alert('Success', 'Friend added!');
            setNewFriendEmail('');
            fetchFriends();
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.detail || 'Failed to add friend');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.header}>My Friends</ThemedText>

            <View style={styles.addFriendContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email or Username"
                    value={newFriendEmail}
                    onChangeText={setNewFriendEmail}
                    autoCapitalize="none"
                />
                <Button title={loading ? "Adding..." : "Add"} onPress={addFriend} disabled={loading} />
            </View>

            <FlatList
                data={friends}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <ThemedText type="defaultSemiBold">{item.username}</ThemedText>
                        <ThemedText style={{ fontSize: 12 }}>{item.email}</ThemedText>
                    </View>
                )}
                ListEmptyComponent={<ThemedText>No friends yet.</ThemedText>}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        marginBottom: 20,
    },
    addFriendContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
