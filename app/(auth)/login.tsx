import { AppButton } from '@/components/app-button';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default function LoginScreen() {
    const { signIn, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
            offlineAccess: true,
        });
    }, []);

    useEffect(() => {
        if (user) {
            router.replace('/(tabs)');
        }
    }, [user]);

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log('Google Auth Response:', JSON.stringify(userInfo, null, 2));

            if (userInfo.data?.idToken) {
                signIn(userInfo.data.idToken);
            } else {
                console.error('No ID token found in response');
            }
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        console.log('User cancelled the login flow');
                        break;
                    case statusCodes.IN_PROGRESS:
                        console.log('Operation (e.g. sign in) is in progress already');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        console.log('Play services not available or outdated');
                        break;
                    default:
                        console.error('Some other error happened:', error);
                }
            } else {
                console.error('An non-recoverable error happened:', error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>Remind Anyone</Text>
            <Text style={styles.subtitle}>Sign in to start sending reminders</Text>

            <AppButton
                disabled={isLoading}
                title={isLoading ? "Signing in..." : "Sign in with Google"}
                onPress={handleGoogleSignIn}
                color="#4A90D9"
            />
            {__DEV__ && (
                <AppButton
                    title="Dev Login (Simulated)"
                    onPress={() => signIn("test-token")}
                    color="#888"
                    style={{ marginTop: 10 }}
                />
            )}

            <TouchableOpacity onPress={() => router.replace('/(auth)/welcome')} style={styles.learnMore}>
                <Text style={styles.learnMoreText}>← Learn more about the app</Text>
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
