import React, { useEffect } from "react"
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { MenuDTO } from "./menuCard"
import { mealTime } from "./reservas"
import { useRouter } from "expo-router"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface MenuFormProps {
    menuData?: MenuDTO
}

export const MenuForm: React.FC<MenuFormProps> = ({ menuData }) => { 
    const [availableDate, setAvailableDate] = React.useState('');
    const [meal, setMealTime] = React.useState<mealTime>();
    const [error, setError] = React.useState('');
    const router = useRouter();

    useEffect(() => {
        if(menuData){
            const formattedDate = new Date(menuData.availableDate ?? new Date()).toISOString().split('T')[0];
            setAvailableDate(formattedDate);
            setMealTime(menuData.mealTime);
        }
    }, [menuData]);

    const handleSubmit = async () => {
        
        const newMenu = {
            availableDate: new Date(availableDate),
            mealTime: meal
        }

        try{
            let response;

            if(menuData?.menuId){
                response = await axios.put(`https://ru-api-production.up.railway.app/webmob/menu/${menuData.menuId}`, newMenu);
            } else {
                response = await axios.post('https://ru-api-production.up.railway.app/webmob/menu', newMenu);
            }

            console.log(response.data);

            if (!menuData) {
                const newMenuId = response.data.newMenu.menuId;
                console.log(newMenuId);
                AsyncStorage.setItem('menuId', newMenuId);
                
                console.log('Menu criado com sucesso');
                router.push({pathname: '/add', params: { menuId: newMenuId }});
            } else {
                router.push({pathname: '/add', params: { menuId: menuData.menuId }});
            }

        } catch (error) {
            console.log(error);
            setError('Erro ao salvar menu. Tente novamente.');
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Menu</Text>
                    <View>
                        <Text style={styles.label}>Data:</Text>
                        <TextInput
                            style={styles.input}
                            value={availableDate}
                            onChangeText={setAvailableDate}
                            placeholder="Selecione a data"
                            keyboardType='numeric'
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Refeição:</Text>
                            <View>
                                <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setMealTime(mealTime.LUNCH)}
                                >
                                <View style={meal === mealTime.LUNCH ? styles.radioSelected : styles.radio} />
                                <Text style={styles.radioLabel}>Almoço</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={styles.radioButton}
                                onPress={() => setMealTime(mealTime.DINNER)}
                                >
                                <View style={meal === mealTime.DINNER ? styles.radioSelected : styles.radio} />
                                <Text style={styles.radioLabel}>Jantar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {menuData ? (
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Editar Menu</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Criar Menu</Text>
                            </TouchableOpacity>
                        )}
            </View>
        </View>
    )
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
})