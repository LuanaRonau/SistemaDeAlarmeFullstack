import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaHome from './Home'  // Tela inicial com botões que levam às configurações ou aos registros
import TelaConfiguracoes from './Configuracoes'  // Controles do sistema
import TelaRegistros from './Registros' // Registros das distâncias lidas

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={TelaHome} />
        <Stack.Screen name="Configuracoes" component={TelaConfiguracoes} />
        <Stack.Screen name="Registros" component={TelaRegistros} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
