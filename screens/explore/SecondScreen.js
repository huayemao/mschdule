import React, { Component } from 'react'
import { EcardStack } from './EcardScreen'

export default class SecondScreen extends Component {

    render() {
        const { navigation, route } = this.props
        if (route.params.name === 'ecard') {
            return <EcardStack></EcardStack>
        }
    }
}