import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axiosClient from "../src/api/axiosClient";
import { router } from "expo-router";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await axiosClient.post("/auth/reset-password-request", { email });
      setMessage("Eğer bu e-posta kayıtlıysa, sıfırlama bağlantısı gönderildi.");
    } catch (err) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifre Sıfırla</Text>

      <Text style={styles.label}>Kayıtlı E-posta Adresiniz</Text>
      <TextInput
        style={styles.input}
        placeholder="ornek@mail.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Şifre Sıfırlama Bağlantısı Gönder</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/login")}> 
        <Text style={styles.link}>Giriş sayfasına dönmek için buraya tıklayın</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
title: {
  fontSize: 28,
  fontWeight: "800",
  color: "#333",
  textAlign: "center",
  marginBottom: 28,
},
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
input: {
  borderWidth: 1,
  borderColor: "#ddd",
  paddingVertical: 12,
  paddingHorizontal: 14,
  borderRadius: 10,
  backgroundColor: "#f9f9f9",
  fontSize: 15,
  marginBottom: 16,
},
button: {
  backgroundColor: "#7B2CBF",
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 8,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
},
buttonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
},
  message: {
    color: "green",
    textAlign: "center",
    marginTop: 12,
  },
  link: {
    color: "#7B2CBF",
    textAlign: "center",
    marginTop: 16,
  },
});

export default ForgotPasswordScreen;