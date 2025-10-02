import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getToken, saveToken } from "../../lib/secureStore";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [biometrySupported, setBiometrySupported] = useState(false);
  const [biometryEnabled, setBiometryEnabled] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricStatus();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometrySupported(compatible && enrolled);
  };

  const checkBiometricStatus = async () => {
    try {
      const token = await getToken();
      const bioEnabled = await SecureStore.getItemAsync("biometryEnabled");
      
      if (token && bioEnabled === "true") {
        setBiometryEnabled(true);
        setShowBiometricPrompt(true);
        setIsFirstLogin(false);
        await authenticateWithBiometrics();
      } else {
        setBiometryEnabled(false);
        setShowBiometricPrompt(false);
      }
    } catch (error) {
      console.error("Error checking biometric status:", error);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Iniciar sesión con huella digital',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsLoggedIn(true);
        Alert.alert("¡Bienvenido!");
      } else {
        setShowBiometricPrompt(false);
      }
    } catch (error) {
      console.error('Error durante autenticación biométrica:', error);
      setShowBiometricPrompt(false);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor ingresa usuario y contraseña");
      return;
    }

    // Aquí iría la validación real con tu backend
    if (username === "user" && password === "1234") {
      await saveToken("fake-jwt-token");
      
      if (enableBiometric) {
        const success = await handleEnableBiometry();
        if (success) {
          await SecureStore.setItemAsync("biometryEnabled", "true");
          setBiometryEnabled(true);
          Alert.alert("Biometría habilitada", "La próxima vez podrás iniciar sesión con tu huella");
        }
      }
      
      setIsLoggedIn(true);
      Alert.alert("¡Bienvenido!");
    } else {
      Alert.alert("Error", "Usuario o contraseña incorrectos");
    }
  };

  const handleEnableBiometry = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Registra tu huella para habilitar el inicio de sesión biométrico",
        fallbackLabel: "Usar contraseña",
      });

      return result.success;
    } catch (error) {
      console.error("Error al habilitar biometría:", error);
      Alert.alert("Error", "No se pudo habilitar la biometría");
      return false;
    }
  };

  const handleUsePassword = () => {
    setShowBiometricPrompt(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (showBiometricPrompt) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TouchableOpacity onPress={authenticateWithBiometrics} style={styles.biometricButton}>
          <Text style={styles.buttonText}>Usar huella digital</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUsePassword} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Usar contraseña</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      
      {biometrySupported && (
        <View style={styles.biometricOption}>
          <Text>Habilitar inicio con huella</Text>
          <Switch
            value={enableBiometric}
            onValueChange={setEnableBiometric}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>
      )}
      
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  biometricButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#34C759",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  biometricOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
});
