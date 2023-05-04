// IMPORTS
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, Linking} from 'react-native';

//IMPORTANTE chave API google-maps: AIzaSyC7_wOMsigz1kkt-XFuRMJ4FseAWH82Lsk
//IMPORTANTE requisição:  https://maps.googleapis.com/maps/api/geocode/json?address=C7X8%2BGF&key=AIzaSyC7_wOMsigz1kkt-XFuRMJ4FseAWH82Lsk


// COMPONENTE
export default function App() {
  const [cep, setCep] = useState("")
  const [endereco, setEndereco] = useState(null)
  const [coord, setCoord] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState("")

//Requisição para API do Maps
  const loc = (obj) => {
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${obj.logradouro} ${obj.bairro} ${obj.localidade}&key=AIzaSyC7_wOMsigz1kkt-XFuRMJ4FseAWH82Lsk`)
          .then(resposta => resposta.json())
          .then(obj => {
            setCoord(obj)
            setErro("")
          })
  }

//Executa a requisição no ViaCep e a requisição do mapa
  const buscarCep = () => {

    if (cep.replace("-", "").length != 8) {
      setErro("CEP inválido")
      return
    }

    setCarregando(true)
    fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json`)
      .then(resposta => resposta.json())
      .then(obj => {
        setEndereco(obj)
        if(obj.erro){
          setErro("CEP não encontrado!")
          return
        }
        else{
          loc(obj)
        }
        setErro("")
      })
      .catch(() => {
        setErro("Ocorreu um erro ao buscar o endereço!")
      })
      .finally(() => {
        setCarregando(false)
      })      
  }


const url = (lat, long) => Platform.select({
  ios: `maps://app?daddr=${lat}+${long}`,
  android: `google.navigation:q=${lat}+${long}`
});

//Acessando objeto das coordenadas (console.log(JSON.stringify(coord.results[0].geometry.location))
const map = (lat, long) => {
  lat = coord.results[0].geometry.location.lat
  long = coord.results[0].geometry.location.lng

  return Linking.openURL(url(lat, long))
}

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Buscando endereço por CEP</Text>
        <Text style={styles.texto}>Digite o CEP:</Text>
        <TextInput placeholder="Digite aqui" style={styles.input} value={cep} onChangeText={input => setCep(input)} />
        <View style={styles.botao}>
          <Button color="#fff" title="Buscar endereço" onPress={buscarCep} />
        </View>
        {carregando && <Text style={styles.texto}>Carregando...</Text>}

        {erro != "" && <Text style={styles.erro}>{erro}</Text>}

        {endereco != null && !carregando && erro == "" && (
          <View style={styles.enderecoCard}>
            <Text style={styles.texto}>CEP - {endereco.cep}</Text>
            <Text style={styles.texto}>Logradouro - {endereco.logradouro}</Text>
            <Text style={styles.texto}>Complemento - {endereco.complemento}</Text>
            <Text style={styles.texto}>Bairro - {endereco.bairro}</Text>
            <Text style={styles.texto}>Localidade - {endereco.localidade}</Text>
            <Text style={styles.texto}>UF - {endereco.uf}</Text>
            <Button style={styles.texto} title='Acessar no Mapa' onPress={map}/>
          </View>
        )}
        <StatusBar style="auto"/>
        </View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  enderecoCard: { padding: 15, backgroundColor: '#f2f4f3' ,  borderRadius: 20 },
  card: { backgroundColor: 'white', padding: 15, borderColor: '#000',  borderRadius: 20  },
  input: { marginVertical: 10, borderColor: '#000', borderWidth: 1,  },
  titulo: {
    fontSize: 25,
    color: '#000',
    marginBottom: 40,
    fontWeight:'bold'
  },
  texto: {
    fontSize: 18,
    color: '#000'
    
  },
  erro: {
    marginVertical:12,
    fontSize: 18,
    color: '#93032e', 
    fontWeight:'bold'
  },
  container: {
    flex: 1,
    backgroundColor:  '#232634' ,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  botao: {
    padding: 5,
    backgroundColor: "#000",
    borderRadius: 20 
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});
