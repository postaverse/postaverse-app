import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface PushNotificationService {
    registerForPushNotifications: () => Promise<string | null>;
    schedulePushNotification: (title: string, body: string, data?: any) => Promise<void>;
    addNotificationListener: (listener: (notification: Notifications.Notification) => void) => Notifications.Subscription;
    addNotificationResponseListener: (listener: (response: Notifications.NotificationResponse) => void) => Notifications.Subscription;
}

class NotificationService implements PushNotificationService {
    async registerForPushNotifications(): Promise<string | null> {
        let token = null;

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
                console.warn('Failed to get push token for push notification!');
                return null;
            }

            try {
                const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
                if (!projectId) {
                    throw new Error('Project ID not found');
                }

                token = (await Notifications.getExpoPushTokenAsync({
                    projectId,
                })).data;

            } catch (error) {
                console.error('Error getting push token:', error);
                return null;
            }
        } else {
            console.warn('Must use physical device for Push Notifications');
        }

        return token;
    }

    async schedulePushNotification(title: string, body: string, data?: any): Promise<void> {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: data || {},
            },
            trigger: { 
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: 1 
            },
        });
    }

    addNotificationListener(listener: (notification: Notifications.Notification) => void): Notifications.Subscription {
        return Notifications.addNotificationReceivedListener(listener);
    }

    addNotificationResponseListener(listener: (response: Notifications.NotificationResponse) => void): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(listener);
    }
}

export const notificationService = new NotificationService();

// Helper function to send notification to backend for push delivery
export const sendNotificationToBackend = async (
    userId: string,
    title: string,
    body: string,
    data?: any
): Promise<void> => {
    try {
        // This would send to your Laravel backend to handle push notifications
        // For now, we'll use local notifications
        await notificationService.schedulePushNotification(title, body, data);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};
