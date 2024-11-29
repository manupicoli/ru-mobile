import { MenuType, MenuCard } from "@/components/menuCard";
import { MenuForm } from "@/components/menuForm";
import axios from "axios";
import { useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Modal } from "react-native";

export default function MenuScreen(){
    const [menus, setMenus] = React.useState([]);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [deleteMenu, setDeleteMenu] = React.useState(null);
    const [editMenu, setEditMenu] = React.useState(null);
    const [showForm, setShowForm] = React.useState(false);

    const getMenus = async () => {
        const menuData = await axios.get('https://ru-api-production.up.railway.app/webmob/menus');
        setMenus(menuData.data);
    }

    const handleEdit = (menu) => {
        setEditMenu(menu);
        setShowForm(true);
        console.log('Editando menu');
    }

    const handleDelete = (menu) => {
        setDeleteMenu(menu);
        setModalVisible(true);        
    }

    const confirmDelete = () => {
        setModalVisible(false);
        const id = deleteMenu.menuId;

        try{
            axios.delete(`https://ru-api-production.up.railway.app/webmob/menu/${id}`);
            getMenus();
        } catch (error) {
            console.log('Erro ao deletar menu', error);
        }

        getMenus();
    }

    const handleCreateNewMenu = () => {
        setEditMenu(null);
        setShowForm(true);
      };

    useEffect(() => {
        getMenus();
    }, []);

    return (
        <View>
            {showForm ? (
                <MenuForm menuData={editMenu}/>
                ) : (
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <TouchableOpacity style={styles.button} onPress={handleCreateNewMenu}>
                            <Text style={styles.buttonText}>Criar novo menu</Text>
                        </TouchableOpacity>

                        {menus.length > 0 ? (
                            (menus.map((menu, index) => (
                                <MenuCard key={index} menu={menu} handleEdit={handleEdit} handleDelete={handleDelete}/>
                            )))
                        ) : (
                            <Text>Nenhum menu cadastrado</Text>
                        )}
                </ScrollView>
                )
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Tem certeza que deseja deletar este menu?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                            <Button title="Deletar" onPress={confirmDelete} color="red" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
        
        
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 4,
        margin: 20
     },
     scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
      },
     buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
     },
     modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});