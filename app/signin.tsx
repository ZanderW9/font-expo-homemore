import { gql, useMutation } from "@apollo/client";
import { GlobalContext } from "@app/_layout";
import { Text, View } from "@components/Themed";
import { storeLocalItem, getLocalItem } from "@config/storageManager";
import Colors from "@constants/Colors";
import { useThemedColors } from "@constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Input, Button } from "@rneui/themed";
import { router, Stack } from "expo-router";
import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { showMessage } from "react-native-flash-message";

const signInMutation = gql`
  mutation SignIn($email: String!, $password: String!) {
    SignIn(email: $email, password: $password) {
      token
      user {
        id
        userName
        avatar
      }
    }
  }
`;

function LoginScreen() {
  const colors = useThemedColors();
  const { httpLinkUrl, setToken, setIsLoggedIn, setApolloClient, setMe } =
    useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [signInFunction, { data, loading, error }] = useMutation(
    signInMutation,
    { errorPolicy: "all" },
  );

  useEffect(() => {
    if (error) {
      error.graphQLErrors.map(() => {
        showMessage({
          type: "danger",
          message: "Invalid email or password",
        });
      });
    }
  }, [error]);

  useEffect(() => {
    if (!loading && data) {
      storeLocalItem("userToken", data.SignIn.token);
      setIsLoggedIn(true);
      setToken(data.SignIn.token);
      setApolloClient(data.SignIn.token, httpLinkUrl);
      setMe(data.SignIn.user);
      router.canGoBack() && router.back();
      router.replace("/profile");
    }
  }, [loading, data]);

  const SignInHandler = async () => {
    signInFunction({ variables: { email, password } });
  };

  const gotoSignupHandler = () => {
    router.navigate("/signup");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (inputText: string) => {
    const lowercaseEmail = inputText.toLowerCase();
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    const isValid = emailPattern.test(lowercaseEmail);
    setIsValidEmail(isValid);
    setEmail(lowercaseEmail);
  };

  const autoLogin = async () => {
    const token = await getLocalItem("userToken");
    if (token) {
      setIsLoggedIn(true);
      setToken(token);
      setApolloClient(token, httpLinkUrl);
      router.replace("/profile");
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <View style={styles.container} theme={{ background: "back2" }}>
      <Stack.Screen
        options={{
          title: "Sign In",
          animation: "slide_from_right",
          headerTitleAlign: "center",
          headerBackTitleVisible: false,
          headerBackButtonMenuEnabled: false,
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
      <Input
        label="Email"
        labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
        containerStyle={styles.inputWrapper}
        inputContainerStyle={[
          styles.inputContainer,
          { borderColor: colors.border1 },
        ]}
        inputStyle={{ color: colors.text }}
        rightIcon={
          isValidEmail && (
            <Ionicons name="checkmark" size={24} color={colors.text} />
          )
        }
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
      />
      <Input
        label="Password"
        labelStyle={{ color: "gray", fontSize: 16, fontWeight: "normal" }}
        containerStyle={styles.inputWrapper}
        inputContainerStyle={[
          styles.inputContainer,
          { borderColor: colors.border1 },
        ]}
        inputStyle={{ color: colors.text }}
        secureTextEntry={!showPassword}
        rightIcon={
          password && (
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={24}
              color={colors.text}
              onPress={togglePasswordVisibility}
            />
          )
        }
        onChangeText={(text) => setPassword(text)}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
        theme={{ background: "back2" }}
      >
        <Button
          buttonStyle={{
            backgroundColor: "rgb(236, 76, 96)",
            height: 50,
            width: 100,
            borderRadius: 7,
            marginVertical: 10,
          }}
          onPress={SignInHandler}
        >
          Sign In
        </Button>
      </View>
      <Text style={styles.title} onPress={gotoSignupHandler}>
        <Text>Don't have an account? </Text>
        Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 15,
    color: Colors.light.tint,
    marginTop: 20,
    marginLeft: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 5,
  },
  inputWrapper: {
    marginBottom: -10,
  },
});

export default LoginScreen;
