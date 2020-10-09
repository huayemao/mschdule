import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Login from './login/Login'

export class ModelScreen extends Component {
    render() {
        return (

            <Login {...this.props}>
            </Login>

        )
    }
}

export default ModelScreen
