import { AppState } from 'react-native'
import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import {SUPABASE_URL,SUPABASE_KEY} from '@env'


// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_KEY;

const supabaseUrl = "https://gfclcjgbzgzdwhrkxpxk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmY2xjamdiemd6ZHdocmt4cHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyOTcxNDQsImV4cCI6MjAzNDg3MzE0NH0.0vI3m4jciF3QPoCQhOuACaTnm8pxWPuDcK82flGnPhM";


// All of this is ripped off: https://supabase.com/docs/guides/auth/quickstarts/react-native
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})
