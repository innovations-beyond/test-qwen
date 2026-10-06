import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ title: "Joelle's Pastries" }} />
        <Stack.Screen name="menu" options={{ title: 'Menu' }} />
        <Stack.Screen name="cart" options={{ title: 'Your Order' }} />
        <Stack.Screen name="order-success" options={{ title: 'Order Confirmed' }} />
        <Stack.Screen name="quotes" options={{ title: 'Event Catering' }} />
        <Stack.Screen name="account" options={{ title: 'My Account' }} />
      </Stack>
    </>
  );
}
