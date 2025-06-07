import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import axiosClient from "../src/api/axiosClient";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const PRIMARY = '#7B2CBF';
const TEXT = '#333';

const RegisterScreen = () => {
  const params = useLocalSearchParams();
  const isGoogleUser = !!params.email;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(params.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd.apps.googleusercontent.com',
    expoClientId: '818824564698-58vpa2gmaci887t5b9nr9kqqjls2udbd.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchGoogleUser(authentication.accessToken);
    }
  }, [response]);

  const fetchGoogleUser = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      const { email, name } = user;

      const check = await axiosClient.post("/auth/google-check", { email });
      if (check?.data?.token) {
        await AsyncStorage.setItem("accessToken", check.data.token);
        await AsyncStorage.setItem("username", check.data.user.username);
        await AsyncStorage.setItem("email", check.data.user.email);
        await AsyncStorage.setItem("role", check.data.user.role);
        await AsyncStorage.setItem("userId", check.data.user._id);

        Alert.alert("Başarılı", "Google ile giriş başarılı!", [
          { text: "Tamam", onPress: () => router.push("/") },
        ]);
      } else {
        router.push({
          pathname: "/register",
          params: { email, name },
        });
      }
    } catch (err) {
      Alert.alert("Hata", "Google kullanıcı bilgisi alınamadı.");
    }
  };

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Hata", "Şifreler uyuşmuyor");
      return;
    }

    try {
      await axiosClient.post("/auth/register", { username, email, password });
      Alert.alert("Başarılı", "Kayıt başarılı! Giriş yapabilirsiniz.", [
        { text: "Tamam", onPress: () => router.push("/login") },
      ]);
    } catch (err) {
      Alert.alert("Hata", err.response?.data?.message || "Kayıt başarısız");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Kayıt Ol</Text>

        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={[styles.input, isGoogleUser && { backgroundColor: '#eee' }]}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          editable={!isGoogleUser}
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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Şifre (tekrar)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity disabled={!request} onPress={() => promptAsync()} style={[styles.button, { backgroundColor: '#DB4437' }]}>
          <Text style={styles.buttonText}>Google ile Kayıt Ol</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}> 
          <Text style={styles.link}>Zaten hesabınız var mı? Giriş Yap</Text>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: TEXT,
  },
  input: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: TEXT,
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 14,
    top: -5,
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: PRIMARY,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    color: PRIMARY,
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
  },
});

export default RegisterScreen;
