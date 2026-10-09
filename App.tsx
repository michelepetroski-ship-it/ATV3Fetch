import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [piada, setPiada] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState<any>(null);
  const [carregandoPiada, setCarregandoPiada] = useState(false);
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [erroCep, setErroCep] = useState('');

  // API Chuck Norris
  const buscarPiada = async () => {
    setCarregandoPiada(true);

    try {
      const resposta = await fetch(
        'https://api.chucknorris.io/jokes/random'
      );

      if (!resposta.ok) {
        throw new Error('Erro ao buscar piada');
      }

      const dados = await resposta.json();
      setPiada(dados.value);
    } catch (erro) {
      setPiada('Não foi possível carregar a piada. Tente novamente.');
    } finally {
      setCarregandoPiada(false);
    }
  };

  // API ViaCEP
  const buscarCEP = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      setErroCep('Digite um CEP válido com 8 números.');
      setEndereco(null);
      return;
    }

    setCarregandoCep(true);
    setErroCep('');
    setEndereco(null);

    try {
      const resposta = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );

      if (!resposta.ok) {
        throw new Error('Erro na consulta do CEP');
      }

      const dados = await resposta.json();

      if (dados.erro) {
        setErroCep('CEP não encontrado.');
      } else {
        setEndereco(dados);
      }
    } catch (erro) {
      setErroCep('Não foi possível consultar o CEP. Tente novamente.');
    } finally {
      setCarregandoCep(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.titulo}>ATV3 - APIs com Fetch</Text>
      <Text style={styles.subtitulo}>
        Consultando APIs na prática
      </Text>

      {/* CHUCK NORRIS */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          😂 Piadas do Chuck Norris
        </Text>

        <Text style={styles.descricao}>
          Clique no botão para buscar uma piada aleatória.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={buscarPiada}
          disabled={carregandoPiada}
        >
          <Text style={styles.textoBotao}>
            {carregandoPiada ? 'Buscando...' : 'Buscar piada'}
          </Text>
        </TouchableOpacity>

        {carregandoPiada && (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loading}
          />
        )}

        {piada !== '' && !carregandoPiada && (
          <View style={styles.resultado}>
            <Text style={styles.textoResultado}>{piada}</Text>
          </View>
        )}
      </View>

      {/* VIACEP */}
      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          📍 Consulta de CEP
        </Text>

        <Text style={styles.descricao}>
          Digite um CEP para consultar o endereço.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex.: 01001-000"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          maxLength={9}
        />

        <TouchableOpacity
          style={styles.botao}
          onPress={buscarCEP}
          disabled={carregandoCep}
        >
          <Text style={styles.textoBotao}>
            {carregandoCep ? 'Consultando...' : 'Buscar endereço'}
          </Text>
        </TouchableOpacity>

        {carregandoCep && (
          <ActivityIndicator
            size="large"
            color="#2563eb"
            style={styles.loading}
          />
        )}

        {erroCep !== '' && (
          <Text style={styles.erro}>{erroCep}</Text>
        )}

        {endereco && (
          <View style={styles.resultado}>
            <Text style={styles.campo}>
              CEP: <Text style={styles.valor}>{endereco.cep}</Text>
            </Text>

            <Text style={styles.campo}>
              Logradouro:{' '}
              <Text style={styles.valor}>
                {endereco.logradouro || 'Não informado'}
              </Text>
            </Text>

            <Text style={styles.campo}>
              Bairro:{' '}
              <Text style={styles.valor}>
                {endereco.bairro || 'Não informado'}
              </Text>
            </Text>

            <Text style={styles.campo}>
              Cidade:{' '}
              <Text style={styles.valor}>
                {endereco.localidade}
              </Text>
            </Text>

            <Text style={styles.campo}>
              Estado:{' '}
              <Text style={styles.valor}>{endereco.uf}</Text>
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.rodape}>
        Atividade: Aplicando o fetch() na prática
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    padding: 20,
    paddingTop: 55,
    paddingBottom: 35,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 15,
    lineHeight: 21,
  },
  botao: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    marginBottom: 15,
  },
  resultado: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  textoResultado: {
    color: '#1e293b',
    fontSize: 15,
    lineHeight: 23,
  },
  campo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  valor: {
    fontWeight: 'normal',
    color: '#475569',
  },
  erro: {
    color: '#dc2626',
    marginTop: 12,
    fontSize: 14,
  },
  loading: {
    marginTop: 15,
  },
  rodape: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 5,
  },
});