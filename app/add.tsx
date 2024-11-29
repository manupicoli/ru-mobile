import { ItemForm } from "@/components/itemForm";
import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { View, Text } from "react-native";

export default function Add() {
    const searchParams = useSearchParams();
    const menuId = searchParams.get('menuId');

    return(
        <View>
            {menuId ? (
                <ItemForm editMenuId={Number(menuId)}/>
             ) : <ItemForm/>}
        </View>
    )
}