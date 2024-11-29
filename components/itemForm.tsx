import React, { useEffect } from "react";
import { ItemsDTO } from "./menuCard";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CheckBox from '@react-native-community/checkbox';
import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity } from "react-native";

interface AddItemProps {
    editMenuId?: number;
}

export const ItemForm: React.FC<AddItemProps> = ({ editMenuId }) => {
    const [items, setItems] = React.useState<ItemsDTO[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
    const [currentMenuId, setCurrentMenuId] = React.useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedMenuId = AsyncStorage.getItem('menuId');
        if (!currentMenuId && storedMenuId) {
            setCurrentMenuId(Number(storedMenuId));
        } 

        if(editMenuId){
            setCurrentMenuId(editMenuId);
        }
    }, [currentMenuId, editMenuId]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('https://ru-api-production.up.railway.app/webmob/items');
                setItems(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {
        if(editMenuId){
            const fetchItems = async () => {
                try {
                    const response = await axios.get(`https://ru-api-production.up.railway.app/webmob/menu/${editMenuId}`);
                    const menuItems = response.data.items.map((item: ItemsDTO) => item.itemId);
                    setSelectedItems(menuItems);
                } catch (error) {
                    console.log(error);
                }
            };

            fetchItems();
        }
    }, []);

    const handleCheckboxChange = (itemId: number) => {
        setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.includes(itemId)
                ? prevSelectedItems.filter((id) => id !== itemId)
                : [...prevSelectedItems, itemId]
        );
    };

    const handleSubmit = async () => {
        try{
            if(!currentMenuId){
                console.log('Menu não encontrado');
                return;
            }

            console.log("items: ", selectedItems);
            console.log(currentMenuId)

            const response = await axios.post(`https://ru-api-production.up.railway.app/webmob/menu/${currentMenuId}/items`, selectedItems);
            
            console.log(response);

            if(response.data){
                router.push({pathname: '/'});
            }

        } catch (error) {
            console.log(error);
        }
    }

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formGroup}>
                {items.map((item) => (
                    <View key={item.itemId} style={styles.formCheck}>
                        <Switch
                            value={item.itemId !== undefined && selectedItems.includes(item.itemId)}
                            onValueChange={() => item.itemId !== undefined && handleCheckboxChange(item.itemId)}
                        />
                        <Text style={styles.label}>{item.name}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>Adicionar itens ao Menu</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    formGroup: {
        marginBottom: 20,
    },
    formCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        marginLeft: 10,
        fontSize: 16,
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