import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axiosClient from "../src/api/axiosClient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../src/context/AuthContext";
import { KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const PRIMARY = '#7B2CBF';
const ACCENT = '#FFD54F';
const TEXT = '#333';

const LoginScreen = () => {
  const { setIsLoggedIn, setUsername, setRole, setEmail: setAuthEmail, setToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd.apps.googleusercontent.com',
  androidClientId: '818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd.apps.googleusercontent.com',
  iosClientId: '818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  redirectUri: AuthSession.makeRedirectUri({ native: 'com.googleusercontent.apps.818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd:/oauth2redirect' }),
});

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication?.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      const { email, name, picture } = user;

      const check = await axiosClient.post("/auth/google-check", { email });
      if (check?.data?.token) {
        const accessToken = check.data.token;
        const user = check.data.user;

        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("username", user.username);
        await AsyncStorage.setItem("email", user.email);
        await AsyncStorage.setItem("role", user.role || 'user');
        await AsyncStorage.setItem("fullname", user.fullname || '');
        await AsyncStorage.setItem("image", user.image || '');
        await AsyncStorage.setItem("userId", user._id || '');

        setIsLoggedIn(true);
        setUsername(user.username);
        setRole(user.role);
        setAuthEmail(user.email);
        setToken(accessToken);

        Alert.alert("Başarılı", "Google ile giriş başarılı!", [
          { text: "Tamam", onPress: () => router.push("/") },
        ]);
      }
    } catch (err) {
      if (err?.response?.status === 404) {
        router.push({
          pathname: "/register",
          params: {
            email: email,
            name: name,
          },
        });
      } else {
        Alert.alert("Hata", "Google ile giriş başarısız");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      const accessToken = res.data.token;
      const refreshToken = res.data.refreshToken;
      const user = res.data.user;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("username", user.username);
      await AsyncStorage.setItem("email", user.email);
      await AsyncStorage.setItem("role", user.role || 'user');
      await AsyncStorage.setItem("fullname", user.fullname || '');
      await AsyncStorage.setItem("birthDate", user.birthDate || '');
      await AsyncStorage.setItem("city", user.city || '');
      await AsyncStorage.setItem("image", user.image || '');
      await AsyncStorage.setItem("userId", user._id || '');

      setIsLoggedIn(true);
      setUsername(user.username);
      setRole(user.role);
      setAuthEmail(user.email);
      setToken(accessToken);

      Alert.alert("Başarılı", "Giriş başarılı!", [
        {
          text: "Tamam",
          onPress: () => router.push("/"),
        },
      ]);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.message || "Giriş başarısız");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 16, top: -5, height: '100%', justifyContent: 'center' }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.link}>Parolanızı mı unuttunuz?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!request}
          onPress={() => promptAsync()}
          style={[styles.button, { backgroundColor: '#DB4437' }]}
        >
          <Text style={styles.buttonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.link}>Hesabınız yok mu? Kayıt olun</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: TEXT,
  },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: TEXT,
    marginBottom: 16,
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: PRIMARY,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
  }
});

export default LoginScreen;
