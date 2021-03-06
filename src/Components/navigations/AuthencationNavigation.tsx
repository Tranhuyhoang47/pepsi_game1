import React from "react";
import SignIn from '../screens/Sign_in';
import SignUp from '../screens/Sign_up';
import commit from "../screens/commit";
import VerifyOtp from "../screens/OTPNotification";

import {createStackNavigator} from '@react-navigation/stack';
import App from "../../../App";
import Home_Screen from "../screens/Home_screen";
import gamePlay from "../screens/gamePlay";

const Stack = createStackNavigator();

export const AuthencationNavigator: React.FC = () => {
    return(
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Sign_up" component={SignUp}/>
            <Stack.Screen name="Sign_in" component={SignIn}/>
            <Stack.Screen name="Commit" component={commit}/>
            <Stack.Screen name="VerifyOtp" component={VerifyOtp}/>
            <Stack.Screen name="Home_Screen" component={Home_Screen}/>
            <Stack.Screen name="gamePlay" component={gamePlay}/>
        </Stack.Navigator>
    );
};