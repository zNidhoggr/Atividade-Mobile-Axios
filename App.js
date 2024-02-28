import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, ScrollView, TextInput } from 'react-native-web';
import axios from 'axios';

import { MMKV } from 'react-native-mmkv'
export const storage = new MMKV()

axios.defaults.baseURL = 'http://10.0.84.192:1337/api';

export default function App() {
  
  const [dados,setDados] = React.useState([]);
  const [usuario,setUsuario] = React.useState('');
  const [senha,setSenha] = React.useState('');
  const [jwt,setJwt] = React.useState('');
  return (
    <View style={styles.container}>
      <TextInput placeholder="Usuário" 
        onChangeText={setUsuario}
      />
      <TextInput placeholder="Senha" 
        onChangeText={setSenha}
        secureTextEntry={true}
      />

      <Button title="Mostrar dados" onPress={()=>{

          console.log(storage.getString('user.name'));
          console.log(storage.getString('user.password'));
        }
      }
      />

      <Button title="Login" onPress={async () => 
          {
              try {
                const response = await axios.post('/auth/local',{identifier:usuario,password:senha});
                //console.log(response.data.jwt);
                setJwt(response.data.jwt);
                storage.set('user.name',usuario);
                storage.set('user.password',senha);

                console.log("OK!");
                
              }
              catch (error) {
                console.log(error);
              }
              
          }
        }
      />
      <Button title="Mostrar informes" onPress={async () => 
        {
            const {data} = await axios.get('/posts', {headers: {Authorization: `Bearer ${jwt}`}});
            //console.log(data.data[1].attributes.autor);
            setDados(data.data);
        }
      } 
      />

      <ScrollView>
        {dados.map((item) => (
          <Text key={item.id}>{item.attributes.name}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100,
    margin: 200,
  },
});
