import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Index() {
    // This will redirect to login by default
    // In a real app, you'd check for a saved token here
    return <Redirect href="/login" />;
}
