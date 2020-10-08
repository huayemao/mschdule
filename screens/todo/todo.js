
import React, { Component } from 'react';
import 'react-native-gesture-handler';

import {
    StyleSheet,
    View,
    StatusBar,
    FlatList
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import Footer from './footer';
import Row from './row';
import Header from './header';
import Loading from '../../components/loading';

const filterItems = (filter, items) => {
    return items.filter((item) => {
        if (filter === "ALL") return true;
        if (filter === "Completed") return item.complete
        if (filter === "Active") return !item.complete
    })
}

export default class Todo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            items: [],
            filter: "ALL",
            datasource: [],
            loading: true,
        }
        this.handleFilter = this.handleFilter.bind(this)
        this.handleAddItem = this.handleAddItem.bind(this);
        this.handleToggleAllComplete = this.handleToggleAllComplete.bind(this)
        this.handleToggleComplete = this.handleToggleComplete.bind(this)
        this.handleRemoveItem = this.handleRemoveItem.bind(this)
        this.handleClearComplete = this.handleClearComplete.bind(this)
        this.handleUpdateText = this.handleUpdateText.bind(this);
        this.handleToggleEditing = this.handleToggleEditing.bind(this)
    }


    async componentDidMount() {
        try {
            let json = await AsyncStorage.getItem("items");
            const items = JSON.parse(json);
            items && this.setState({ items: items, datasource: items, loading: false })
        }
        catch (e) {
            console.log(e)
        }

        this.setState({ loading: false })


        // this.animation.play();
        // Or set a specific startFrame and endFrame with:
        // this.animation.play();
    }

    handleUpdateText(key, text) {
        const newItems = this.state.items.map((item) => {
            if (item.key !== key) return item
            return { ...item, text }
        })
        this.setState({ items: newItems, datasource: filterItems(this.state.filter, newItems) })
        AsyncStorage.setItem('items', JSON.stringify(newItems))
    }

    handleToggleEditing(key, editing) {
        const newItems = this.state.items.map((item) => {
            if (item.key !== key) return item
            return {
                ...item,
                editing
            }
        })
        this.setState({ items: newItems, datasource: filterItems(this.state.filter, newItems) })
        AsyncStorage.setItem('items', JSON.stringify(newItems))
    }


    handleClearComplete() {
        const newItems = filterItems("Active", this.state.items);
        this.setState({ items: newItems, datasource: filterItems(this.state.filter, newItems) })

    }
    handleRemoveItem(key) {
        const newItems = this.state.items.filter((item) => {
            return item.key !== key
        })
        this.setState({ items: newItems, value: "", datasource: filterItems(this.state.filter, newItems) })
        AsyncStorage.setItem('items', JSON.stringify(newItems))
    }

    handleToggleComplete(key) {
        const newItems = this.state.items.map((item) => {

            const a = !item.complete
            if (item.key !== key) return item;
            return { ...item, complete: a }
        })
        this.setState({ items: newItems, value: "", datasource: filterItems(this.state.filter, newItems) })

    }

    handleToggleAllComplete() {
        const complete = !this.state.allComplete;
        const newItems = this.state.items.map((item) => ({
            ...item,
            complete
        }))
        console.table(newItems);
        this.setState({ items: newItems, allComplete: complete, datasource: filterItems(this.state.filter, newItems) })
    }

    handleFilter(filter) {
        this.setState({ datasource: filterItems(filter, this.state.items), filter: filter })
    }

    handleAddItem() {
        if (!this.state.value) return
        const newItems = [
            ...this.state.items,
            {
                key: Date.now().toString(),
                text: this.state.value,
                complete: false
            }
        ]
        this.setState({ items: newItems, value: "", datasource: filterItems(this.state.filter, newItems) })
        AsyncStorage.setItem('items', JSON.stringify(newItems))
    }



    render() {


        return (
            <>
                <Header
                    value={this.state.value}
                    onAddItem={this.handleAddItem}
                    onToggleAllComplete={this.handleToggleAllComplete}
                    onChange={(value) => this.setState({ value })} />
                <Footer
                    onClearComplete={this.handleClearComplete}
                    onFilter={this.handleFilter} filter={this.state.filter} count={filterItems('Active', this.state.items).length}></Footer>

                <View style={styles.content}>


                    <FlatList
                        style={styles.list}
                        data={this.state.datasource}
                        renderItem={({ item }) => {
                            return <Row key={item.key} {...item}
                                onRemove={() => this.handleRemoveItem(item.key)}
                                onUpdate={(text => this.handleUpdateText(item.key, text))}
                                onToggleEdit={(editing) => this.handleToggleEditing(item.key, editing)}
                                onComplete={(complete) => this.handleToggleComplete(item.key, complete)}></Row>
                        }}
                        ItemSeparatorComponent={(sectionId, rowId) => { return <View key={rowId} style={styles.separator} /> }}
                    />


                </View>

                {this.state.loading && <View style={styles.loading}>
                    <Loading></Loading>
                </View>}

            </>
        );
    }
}

const styles = StyleSheet.create({

    content: {
        flex: 1
    },
    list: {
        backgroundColor: '#FFF',
    },
    separator: { borderWidth: 1, borderColor: "#F5F5F5" },
    loading: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: 'rgba(0,0,0,.2)'
    },
});