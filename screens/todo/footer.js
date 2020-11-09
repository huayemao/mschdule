import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants';
export default class Footer extends Component {
  render() {
    const { filter } = this.props;
    return (
      <>
        <View>
          <Text style={styles.title}>TODO LIST</Text>
          <Text style={styles.count}>{this.props.count} todos</Text>
        </View>
        <View style={styles.container}>

          <View style={styles.filters}>
            <TouchableOpacity style={[styles.filter, filter === 'ALL' && styles.selected]} onPress={() => this.props.onFilter("ALL")}>
              <Text style={[styles.filterText, filter === 'ALL' && styles.selectedText]}>全部</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filter, filter === 'Active' && styles.selected]} onPress={() => this.props.onFilter("Active")}>
              <Text style={[styles.filterText, filter === 'Active' && styles.selectedText]}>待办</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filter, filter === 'Completed' && styles.selected]} onPress={() => this.props.onFilter("Completed")}>
              <Text style={[styles.filterText, filter === 'Completed' && styles.selectedText]}>已完成</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={this.props.onClearComplete}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, paddingEnd: 10, color: theme.colors.forRed }}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: 'white'
  },
  filter: {
    padding: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    borderColor: 'transparent',

  },
  filters: {
    flexDirection: "row"
  },
  selected: {
    borderBottomColor: theme.colors.primary,
    borderBottomWidth: 2
  },
  selectedText: {
    color: theme.colors.primary,

  },
  title: {
    lineHeight: 50,
    color: '#8795a1',
    fontSize: 20,
    backgroundColor: 'white',
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 2,
    paddingHorizontal: 10
  },
  count: {
    textAlignVertical: 'center',
    color: theme.colors.primary,
    position: 'absolute',
    top: '30%',
    fontSize: 16,
    right: 14,
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  filterText: {
    fontSize: 16,
  }
})