import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Button, Image, StyleSheet, View } from 'react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.header}>Profile</ThemedText>

            {user && (
                <View style={styles.info}>
                    {user.picture && (
                        <Image source={{ uri: user.picture }} style={styles.avatar} />
                    )}
                    <ThemedText type="subtitle">{user.full_name || 'No Name'}</ThemedText>
                    <ThemedText>@{user.username}</ThemedText>
                    <ThemedText>{user.email}</ThemedText>
                </View>
            )}

            <View style={styles.actions}>
                <Button title="Sign Out" onPress={signOut} color="#ff4444" />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    header: {
        marginBottom: 40,
    },
    info: {
        alignItems: 'center',
        marginBottom: 40,
        gap: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
        backgroundColor: '#ccc',
    },
    actions: {
        width: '100%',
    },
});
