import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export enum mealTime {
    LUNCH = 'Almoço',
    DINNER = 'Janta',
}

export const ReservationForm: React.FC = () => {
  const [date, setDate] = useState('');
  const [meal, setMeal] = useState('');
  const route = useRouter();

  const handleSubmit = async () => {
    try{
        const response = await axios.post(`https://ru-api-production.up.railway.app/webmob/reservation/6`, {
            reservationDate: new Date(date),
            mealTime: meal
        });

        if(response.data){
            console.log('Reserva feita com sucesso', response.data);
            route.push('/');
        }
    } catch (error) {
        console.log('Erro ao fazer reserva', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reservar Refeição</Text>
        <View>
          <Text style={styles.label}>Matrícula:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua matrícula"
          />
        </View>
        <View>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
          />
        </View>
        <View>
          <Text style={styles.label}>Data:</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="Selecione a data"
            keyboardType='numeric'
          />
        </View>
        <View>
          <Text style={styles.label}>Refeição:</Text>
          <View>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setMeal(mealTime.LUNCH)}
            >
              <View style={meal === mealTime.LUNCH ? styles.radioSelected : styles.radio} />
              <Text style={styles.radioLabel}>Almoço</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setMeal(mealTime.DINNER)}
            >
              <View style={meal === mealTime.DINNER ? styles.radioSelected : styles.radio} />
              <Text style={styles.radioLabel}>Jantar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Reservar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
 },
 formContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
 },
 title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
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
 radio: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
 },
 radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5
 },
 radioSelected:{
    height: 15,
    width: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    backgroundColor: '#007bff',
 },
 radioLabel: {
    marginLeft: 5,
 },
 button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
    margin: 20
 },
 buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
 }
});