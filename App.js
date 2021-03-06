import React, { Component, useReducer, useContext, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, CheckBox, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

appReducer = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return action.payload.map(item => item);
    }
    case 'add': {
      return [
        ...state,
        {
          'id': Date.now(),
          'text': '',
          'completed': false
        }
      ]
    }
    case 'text': {
      return state.map((item) => {
        if (action.id === item.id) {
          return {
            ...item,
            text: action.payload
          }
        }
        return item;
      })
    }
    case 'delete': {
      // it could be return state.filter(item=>item.id!==action.payload)
      return state.filter((item) => {
        return item.id !== action.payload
      })
    }
    case 'completed': {
      return state.map((item) => {
        if (item.id === action.payload) {
          return { ...item, completed: !item.completed }
        };
        return item;
      })
    }
    default: {
      return state;
    }
  }
}

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    // saving error
  }
}

getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      // value previously stored
      // console.warn(value)
      return value
    }
  } catch (e) {
    console.warn(e)
    // error reading value
  }
}

removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (e) {
    // remove error
  }

  console.log('Done.')
}

const Context = React.createContext();

useEffectOnce = (callBack) => {
  const didRun = useRef(false);

  useEffect(() => {
    if (!didRun.current) {
      callBack();
      didRun.current = true;
    }
  })
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, [])

  this.useEffectOnce(()=>{
    this.getData('data').then(data => dispatch({ type: 'reset', payload: JSON.parse(data) }));

  });

  useEffect(
    () => {
      this.storeData('data', JSON.stringify(state));
    },
    [state]
  );

  return (
    <Context.Provider value={dispatch} >
      <View style={styles.container}>
        <Text style={styles.welcome}>Todo App Using Hook</Text>
        <TodosList state={state} />
        <TouchableOpacity onPress={() => dispatch({ type: 'add' })}><Text>Add Todo</Text></TouchableOpacity>
      </View>
    </Context.Provider>
  );
}

TodosList = ({ state }) => { // it can also be props and retrievel will be props.state
  return (
    <View>
      {
        state.map((item) => {
          return (
            <TodoItem key={item.id} {...item} />
          )
        })
      }
    </View>)
}

TodoItem = ({ id, completed, text }) => { //again it can be props and retreivel will be props.id
  const dispatch = useContext(Context);
  return (
    <View style={{ marginBottom: 5 }}>
      <View style={{ flexDirection: 'row', }}>
        <CheckBox value={completed} onValueChange={() => dispatch({ type: 'completed', payload: id })} />
        <TextInput
          onChangeText={(text) => dispatch({ type: 'text', payload: text, id: id })}
          style={{ borderColor: 'gray', borderWidth: 1, width: 100 }} />
        <TouchableOpacity onPress={() => dispatch({ type: 'delete', payload: id })} >
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
      <Text >{text}</Text>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
