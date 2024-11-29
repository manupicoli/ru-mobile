import ReservationForm from "@/components/reservas";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function ReservasScreen(){
    const navigation = useNavigation();

    return (
        <View>
            <ReservationForm/>
        </View>
    )
}