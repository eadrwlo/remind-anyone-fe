import { AppButton } from '@/components/app-button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';

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
    const { t } = useTranslation();

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
            Alert.alert(t('friends.alertSuccessTitle'), t('friends.alertSuccessBody'));
            setNewFriendEmail('');
            fetchFriends();
        } catch (e: any) {
            Alert.alert(t('friends.alertErrorTitle'), e.response?.data?.detail || t('friends.alertErrorBody'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.header}>{t('friends.title')}</ThemedText>

            <View style={styles.addFriendContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={t('friends.placeholder')}
                    value={newFriendEmail}
                    onChangeText={setNewFriendEmail}
                    autoCapitalize="none"
                />
                <AppButton
                    title={loading ? t('friends.adding') : t('friends.add')}
                    onPress={addFriend}
                    disabled={loading}
                    compact
                    fullWidth={false}
                    color="#4CAF50"
                />
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
                ListEmptyComponent={<ThemedText>{t('friends.empty')}</ThemedText>}
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
