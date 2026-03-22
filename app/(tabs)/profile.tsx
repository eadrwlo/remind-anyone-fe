import { AppButton } from '@/components/app-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Image, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { t } = useTranslation();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.header}>{t('profile.title')}</ThemedText>

            {user && (
                <View style={styles.info}>
                    {user.picture && (
                        <Image source={{ uri: user.picture }} style={styles.avatar} />
                    )}
                    <ThemedText type="subtitle">{user.full_name || t('profile.noName')}</ThemedText>
                    <ThemedText>@{user.username}</ThemedText>
                    <ThemedText>{user.email}</ThemedText>
                </View>
            )}

            <View style={styles.actions}>
                <AppButton title={t('profile.signOut')} onPress={signOut} color="#F44336" />
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
