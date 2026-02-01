import { useAuth } from '@/context/AuthContext';
import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    const { signIn, user, isLoading } = useAuth();
    const router = useRouter();

    const requestScheme = 'com.googleusercontent.apps.109055600533-4p97gnb7hggs6c99r2f7r61sku2a7gif';

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
        redirectUri: makeRedirectUri({
            scheme: requestScheme,
            path: 'oauthredirect'
        }),
        scopes: ['profile', 'email', 'openid'],
        responseType: ResponseType.IdToken,
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
            <Text style={styles.title}>Remind Anyone</Text>
            <Text style={styles.subtitle}>Sign in to start sending reminders</Text>

            <Button
                disabled={!request || isLoading}
                title={isLoading ? "Signing in..." : "Sign in with Google (Web)"}
                onPress={() => promptAsync()}
            />
            {/* Fallback for development if Google ID not set */}
            {__DEV__ && (
                <Button
                    title="Dev Login (Simulated)"
                    onPress={() => signIn("test-token")}
                />
            )}
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
});
