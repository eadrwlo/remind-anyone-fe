import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import api from './api';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            // alert('Failed to get push token for push notification!');
            console.log('Failed to get push token for push notification!');
            return;
        }

        // Get the token (use project ID if needed, but usually Expo handles it with just getExpoPushTokenAsync())
        // Note: If using EAS Build, projectId is required in app.json/app.config.js and usually picked up auto.
        // If not, we might need to pass it explicitly: { projectId: '...' }
        try {
            const tokenData = await Notifications.getExpoPushTokenAsync();
            token = tokenData.data;
            console.log('Expo Push Token:', token);
        } catch (e) {
            console.error("Error fetching push token", e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    if (token) {
        await sendTokenToBackend(token);
    }

    return token;
}

async function sendTokenToBackend(token: string) {
    try {
        await api.put('/auth/me/device-token', { token });
        console.log('Device token updated on backend');
    } catch (error) {
        console.error('Failed to update device token on backend', error);
    }
}
