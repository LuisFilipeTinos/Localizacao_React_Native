import { View, 
         Alert, 
         TouchableOpacity, 
         Text, 
         StyleSheet, 
         Linking 
} from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';


export default function App() {

  const [coordenadas, setCoordenadas] = useState(null);

  async function gerenciarPermissao() {
    let permissaoAtual = await Location.getForegroundPermissionsAsync();

    if (permissaoAtual.status !== "granted") {
      permissaoAtual = await Location.requestForegroundPermissionsAsync();
    }

    if (permissaoAtual.status === "granted") {
      const posicao = await Location.getCurrentPositionAsync();
      setCoordenadas(posicao.coords);
    }
    else {
      setTimeout(() => {
        Alert.alert(
          "Permissão de Localização",
          "Você precisa permitir o acesso à localização para continuar.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Configurações", onPress: () => Linking.openSettings() }
          ]
        )
      }, 100);
    }
  }

  function mostrarCoordenadas() {
    if (coordenadas != null) {
      return (
        <Text>
          Latitude:  {coordenadas.latitude.toFixed(5)} |
          Longitude: {coordenadas.longitude.toFixed(5)}
        </Text>
      )
    }
  }

  function exibeMapa()  {
    if (coordenadas) {
      return (
        <MapView
          style={{ flex: 1 }}
          region={{
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
          userInterfaceStyle="light"
          showsUserLocation={true}
        >
          <Marker coordinate={{ 
            latitude: coordenadas.latitude,
            longitude: coordenadas.longitude
          }}
            title="Teste"
            draggable
           />
        </MapView>
      );
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.titulo}>Permissão de Localização</Text>
          <View style={styles.centralizar}>
            <TouchableOpacity style={styles.fundoBotao} onPress={gerenciarPermissao}>
              <Text style={styles.textoBotao}>Pedir Localização</Text>
            </TouchableOpacity>
          </View>

          {mostrarCoordenadas()}

          {exibeMapa()}

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  centralizar: {
    justifyContent: "center",
    alignItems: "center",
  },
  fundoBotao: {
    backgroundColor: "blue",
    borderRadius: 8,
    width: 200,
    padding: 5
  },
  textoBotao: {
    color: "white",
    textAlign: "center",
    fontSize: 16
  }
});


