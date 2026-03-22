import { AppButton } from '@/components/app-button';
import { useAuth } from '@/context/AuthContext';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { signIn, user, isLoading } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        scopes: ['profile', 'email', 'openid'],
        responseType: ResponseType.IdToken,
        redirectUri: makeRedirectUri({
            preferLocalhost: true,
        }),
    });

    useEffect(() => {
        if (request) {
            // Request loaded
        }
    }, [request]);

    useEffect(() => {
        if (response?.type === 'success') {
            console.log('Google Auth Response:', JSON.stringify(response, null, 2));
            const id_token = response.authentication?.idToken || response.params?.id_token;
            if (id_token) {
                signIn(id_token);
            } else {
                console.error('No ID token found in response');
            }
        } else if (response) {
            console.log('Google Auth Response (Not Success):', JSON.stringify(response, null, 2));
        }
    }, [response]);

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>

            <AppButton
                disabled={!request || isLoading}
                title={isLoading ? t('login.signingIn') : t('login.signInGoogle')}
                onPress={() => promptAsync()}
                color="#4A90D9"
            />
            {__DEV__ && (
                <AppButton
                    title={t('login.devLogin')}
                    onPress={() => signIn("test-token")}
                    color="#888"
                    style={{ marginTop: 10 }}
                />
            )}

            <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')} style={styles.learnMore}>
                <Text style={styles.learnMoreText}>{t('login.learnMore')}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    logo: {
        width: 240,
        height: 240,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    learnMore: {
        marginTop: 24,
        paddingVertical: 6,
    },
    learnMoreText: {
        color: '#888',
        fontSize: 14,
    },
});
