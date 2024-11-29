import { Link, useRouter } from "expo-router";
import axios from 'axios';
import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const router = useRouter();

    const handleLogin = async () => {
        if(email && password){
            try {
                const response = await axios.post("https://ru-api-production.up.railway.app/webmob/login", {
                    email: email,
                    password: password
                });

                if(response.data.token){
                    await AsyncStorage.setItem('token', response.data.token);
                    await AsyncStorage.setItem('userId', response.data.user.id.toString());
                    router.replace('/');
                } else {
                    setErrorMessage('Credenciais inválidas');
                }

            } catch (error) {
                console.log(error);
                setErrorMessage('Erro ao fazer login. Por favor, tente novamente.');
            }
        } else {
            setErrorMessage('Preencha todos os campos');
        }
    };

    return (
        <View style={styles.loginContainer}>
        <Text style={styles.header}>Login:</Text>
            <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none" 
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput 
                    style={styles.input} 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}    
                <Button title="Login" onPress={handleLogin} />
            </View>

            <Text style={styles.text}>Ainda não tem conta?</Text>
            <Link style={styles.link} href={"/signup"}>Cadastre-se!</Link> 
        </View>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        height: 'auto',
        margin: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
      },
      header: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
      },
      form: {
        display: 'flex',
        flexDirection: 'column',
      },
      label: {
        marginBottom: 5,
        marginRight: 5,
        fontWeight: 'bold',
      },
      input: {
        marginBottom: 15,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
      },
      error: {
        color: 'red',
        marginBottom: 15,
      },
      button: {
        padding: 10,
        backgroundColor: '#007bff',
        color: '#fff',
        borderWidth: 0,
        borderRadius: 4,
        cursor: 'pointer',
      },
      text: {
        padding: 10,
        display: 'flex',
        textAlign: 'center'
      },
      link: {
        display: 'flex',
        textAlign: 'center',
        color: '#007bff'
      }
});