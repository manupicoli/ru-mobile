import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Touchable, TouchableOpacity, Modal, Button } from "react-native";
import { mealTime } from "./reservas";

export enum MenuType {
    WEEKLY = 'WEEKLY',
    ALL = 'ALL'
}

export interface ItemsDTO{
    itemId?: number,
    name?: string,
    description?: string
}

export interface MenuDTO {
    menuId?: number,
    availableDate?: Date,
    mealTime?: mealTime,
    items?: ItemsDTO[]
}

interface MenuCardProps {
    menu: MenuDTO;
    handleEdit?: (menu: MenuDTO) => void;
    handleDelete?: (menu: MenuDTO) => void;
}

export function formatDate(date?: Date): string {
    if (!date) {
        return 'Data não disponível';
    }
    const updatedDate = typeof date === 'string' ? new Date(date) : date;
    const localDate = new Date(updatedDate.getTime() + updatedDate.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export const MenuCard: React.FC<MenuCardProps> = ({ menu, handleEdit, handleDelete }) => {

    return (
        <View style={styles.container}>
            <View style={styles.formContainer} key={menu.menuId.toString()}>
                <Text style={styles.title}>{formatDate(menu.availableDate)}</Text>
                <Text style={styles.subtitle}>{menu.mealTime}</Text>
                <View>
                    {menu.items?.map((menuItem, index) => (
                        <Text key={index} style={styles.menuItem}>{menuItem.name}</Text>
                    ))}
                </View>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => handleDelete(menu)}>
                        <MaterialCommunityIcons size={20} name="delete" color='red' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEdit(menu)}>
                        <MaterialCommunityIcons size={20} name="application-edit" />
                    </TouchableOpacity>
                </View>
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
       padding: 10,
       backgroundColor: '#f9f9f9',
       borderRadius: 8,
       borderWidth: 1,
    },
    title: {
       fontSize: 24,
       textAlign: 'center',
       marginBottom: 10,
    },
    button: {
        flexDirection: 'row-reverse',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
    },
    menuItem: {
        fontSize: 16,
        marginBottom: 5,
    }
});