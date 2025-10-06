import LoginForm from "@/components/auth/LoginForm";
import { CopyrightText } from "@/components/ui/text/CopyrightText";
import * as LocalAuthentication from "expo-local-authentication";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  View
} from "react-native";
import { getToken } from "../../lib/secureStore";

export default function LoginScreen() {
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [biometryEnabled, setBiometryEnabled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [biometrySupported, setBiometrySupported] = useState(false);

  useEffect(() => {
    const initBiometrics = async () => {
      try {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometrySupported(compatible && enrolled);

        if (compatible && enrolled) {
          await checkBiometricStatus();
        }
      } catch (error) {
        console.error("Error initializing biometrics:", error);
      } finally {
        setLoading(false);
      }
    };

    initBiometrics();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      const token = await getToken();
      const bioEnabled = await SecureStore.getItemAsync("biometryEnabled");

      // Only attempt auto-login if both token and biometrics are enabled
      if (token && bioEnabled === "true") {
        setBiometryEnabled(true);
        setShowBiometricPrompt(true);
        await authenticateWithBiometrics();
      } else {
        setBiometryEnabled(bioEnabled === "true");
        setShowBiometricPrompt(false);
      }
    } catch (error) {
      console.error("Error checking biometric status:", error);
      setShowBiometricPrompt(false);
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithBiometrics = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Iniciar sesión con huella digital",
        fallbackLabel: "Usar contraseña",
        disableDeviceFallback: true,
      });

      if (result.success) {
        // Check if we have stored credentials
        const user = await SecureStore.getItemAsync("user");
        const pass = await SecureStore.getItemAsync("pass");

        if (user && pass) {
          // We'll let the LoginForm handle the actual login
          // Just navigate to tabs if we have valid credentials
          router.replace("/(tabs)");
        } else {
          // No stored credentials, disable biometrics
          await SecureStore.setItemAsync("biometryEnabled", "false");
          setBiometryEnabled(false);
          setShowBiometricPrompt(false);
        }
      } else {
        setShowBiometricPrompt(false);
      }
    } catch (error) {
      console.error("Error durante autenticación biométrica:", error);
      setShowBiometricPrompt(false);
    }
  };

  const handleEnableBiometry = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          "Registra tu huella para habilitar el inicio de sesión biométrico",
        fallbackLabel: "Usar contraseña",
      });

      if (result.success) {
        await SecureStore.setItemAsync("biometryEnabled", "true");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al habilitar biometría:", error);
      Alert.alert("Error", "No se pudo habilitar la biometría");
      return false;
    }
  };
  return (
    <>
      <ImageBackground
        source={require("../../assets/images/login-screen.jpg")}
        resizeMode="cover"
        className="h-[95%]"
      >
        <SafeAreaView className="flex-1 bg-emerald-800/25 ">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center p-6 "
          >
            <View className="bg-white/90 rounded-3xl shadow-xl p-8">
              <Text className="text-4xl  mb-3 text-green-800 text-center font-SoraExtraBold">
                Lawn Tennis LR
              </Text>
              <Text className="text-lg text-gray-600 mb-6 text-center ">
                Reserva tu cancha y vive el tenis
              </Text>

              <LoginForm
                isBiometricEnabled={biometryEnabled}
                handleEnableBiometry={handleEnableBiometry}
                setBiometryEnabled={setBiometryEnabled}
                isLoginWithBiometric={showBiometricPrompt}
              />
              {/* {biometrySupported && (
                <TouchableOpacity
                  onPress={authenticateWithBiometrics}
                  className="mt-10 flex-row items-center"
                >
                  <Fingerprint size={24} color="#047857" />
                  <Text className="ml-2 text-green-700 font-SoraSemiBold">
                    Iniciar con huella digital
                  </Text>
                </TouchableOpacity>
              )}
              {biometrySupported && (
                <View className="flex-row justify-between items-center mt-5">
                  <Text>Habilitar inicio con huella</Text>
                  <Switch
                    value={biometryEnabled}
                    onValueChange={async (value) => {
                      if (value) {
                        const success = await handleEnableBiometry();
                        setBiometryEnabled(success);
                      } else {
                        await SecureStore.setItemAsync(
                          "biometryEnabled",
                          "false"
                        );
                        setBiometryEnabled(false);
                      }
                    }}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
              )} */}

              <View className="flex-row justify-between items-center mt-5">
                <Link href="/auth/resendCodeChangePassword">
                  <Text className="text-md text-green-700 font-Sora ">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Link>
                <Link href="/auth/register">
                  <Text className="text-md text-gray-700 font-Sora">
                    Crear cuenta
                  </Text>
                </Link>
              </View>
            </View>
            <CopyrightText />
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}
