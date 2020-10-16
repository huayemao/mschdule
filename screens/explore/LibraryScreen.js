import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    Modal,
    Image,
    StyleSheet,
    Animated,
    Dimensions,
    RefreshControl,
    Picker
} from 'react-native';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/colors';
import { TouchableNativeFeedback, FlatList } from 'react-native-gesture-handler';

import { Button, Text as Text1, Block, Input, } from '../../components'
import LibraryService from '../../services/libraryService'
import { theme } from '../../constants';
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get("window");

let pageTorender = 1;


export class Library extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            searchFocus: new Animated.Value(0.6),
            searchString: null,
            refreshing: false,
            showTerms: false,
            filters: {
                // bookTypes: null,
                // publishers: null,
                // authors: null,
                // years: null,
                // refreshing: null,
                // authors: null
            }
        }
    }

    setFilterParameters(key, value) {
        let temp = {};
        temp[key] = encodeURI(value.replace(value.match(/\(\d*\)/)[0], ''))
        console.log(temp)
        this.setState({
            filters: {
                // ...this.state.filters,
                ...temp
            }
        })
        //   
        // let str=`page=${page}&strKeyValue=${this.state.searchString}&strType=text&tabletype=*&RepSearch=&strKeyValue2=&&strAllAuthor=&strAllPubyear=&strAllPublish=${publishers}&strAllLanguage=&strCondition2=&strpageNum=20&strVip=&strStartYear=&strEndYear=&strPublisher=&strAuthorer=&strSortType=&strSort=desc`

    }

    renderFooter() {
        return (
            <>
                <LinearGradient
                    locations={[0.5, 1]}
                    style={styles.footer}
                    colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.6)"]}
                >
                    <Button gradient style={{ width: width / 3, height: 45 }} onPress={() => { pageTorender = 1; this.search(pageTorender) }}>
                        <Text1 bold white center>
                            搜索
                        </Text1>
                    </Button>
                </LinearGradient>
            </>
        );
    }

    renderSearch() {
        const { searchString, searchFocus } = this.state;
        const isEditing = searchFocus && searchString;

        return (
            <Block animated middle flex={searchFocus} style={styles.search}>
                <Input
                    placeholder="Search"
                    placeholderTextColor={theme.colors.gray2}
                    style={styles.searchInput}
                    onFocus={() => this.handleSearchFocus(true)}
                    onBlur={() => this.handleSearchFocus(false)}
                    onChangeText={text => this.setState({ searchString: text })}
                    value={searchString}
                    onRightPress={() =>
                        isEditing ? this.setState({ searchString: null }) : null
                    }
                    rightStyle={styles.searchRight}

                    rightLabel=
                    {
                        <Icon
                            name={isEditing ? "ios-close" : "ios-search"}
                            size={theme.sizes.base / 1.2}
                            color={theme.colors.gray2}
                            style={styles.searchIcon}
                        />
                    }
                />
            </Block>
        );
    }


    handleSearchFocus(status) {
        Animated.timing(this.state.searchFocus, {
            toValue: status ? 0.8 : 0.6, // status === true, increase flex size
            duration: 150 // ms
        }).start();
    }

    search(page, cover = true) {
        this.setState({ refreshing: true })
        let { searchString } = this.state;
        let filters = {
            ...this.state.filters,
            publishers: this.state.filters.publishers || ''
        }



        LibraryService.searchBook(searchString, page, filters.publishers).then(data => {
            this.setState({
                data: {
                    ...data,
                    books: (this.state.data.books && !cover) ? [...this.state.data.books, ...data.books] : data.books,
                },
                refreshing: false,
            })
            // console.log(data)
        });

    }

    renderItems({ item }) {
        return (
            <Item book={item}></Item>
        )
    }
    renderTermsService() {
        const { data, filters } = this.state;
        return (
            <Modal
                style={{ height: 300 }}
                animationType="slide"
                visible={this.state.showTerms}
                onRequestClose={() => this.setState({ showTerms: false })}
            >
                <Block
                    padding={[theme.sizes.padding * 2, theme.sizes.padding]}
                    space="between"
                >
                    <Text1 gray>文献类型</Text1>
                    <Block flex={false} row padding={[theme.sizes.base]}>
                        {data.bookTypes && data.bookTypes.map((e, i) => {

                            return (
                                <Text1 key={'' + i + ''} caption gray style={styles.tag}>
                                    {e}
                                </Text1>
                            )
                        })}


                    </Block>

                    <Text1 gray>出版社</Text1>

                    <Block row middle flex={false} center margin={[theme.sizes.base]} style={{
                        borderColor: theme.colors.gray2,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: theme.sizes.base / 2,
                        paddingVertical: theme.sizes.base / 3,
                    }}>

                        <Picker style={{ width: '100%', height: 20, fontSize: 14, color: theme.colors.gray }}
                            onValueChange={(value) => {
                                this.setFilterParameters('publishers', value)
                            }}
                            prompt={"出版社"} selectedValue={filters.publishers || 'all'}>
                            <Picker.Item label="全部" value="all" />
                            {data.publishers && data.publishers.map((e, i) => {
                                return (
                                    <Picker.Item key={'' + i + ''} label={e} value={e} />
                                )
                            })}
                        </Picker>
                    </Block>

                    <Text1 gray>作者</Text1>

                    <Block row middle flex={false} center margin={[theme.sizes.base]} style={{
                        borderColor: theme.colors.gray2,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: theme.sizes.base / 2,
                        paddingVertical: theme.sizes.base / 3,

                    }}>

                        <Picker style={{ width: '100%', height: 20, fontSize: 14, color: theme.colors.gray }}
                            prompt={"作者"} selectedValue={this.state.filters.authors || 'all'}
                            onValueChange={(value) => {
                                this.setState({
                                    filters: {
                                        // ...this.state.filters,
                                        authors: value
                                    }
                                })

                            }}

                        >
                            <Picker.Item label="全部" value="all" />
                            {data.authors && data.authors.map((e, i) => {
                                return (
                                    <Picker.Item key={'' + i + ''} label={e} value={e} />
                                )
                            })}
                        </Picker>
                    </Block>


                    <Text1 gray style={{ textAlignVertical: 'center' }}>出版年</Text1>
                    <Block row middle center flex={false} margin={[theme.sizes.base]} style={{
                        borderColor: theme.colors.gray2,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderRadius: theme.sizes.base / 2,
                        paddingVertical: theme.sizes.base / 3,

                    }}>

                        <Picker style={{ width: '100%', height: 20, fontSize: 14, color: theme.colors.gray }}
                            onValueChange={() => {
                                this.setState({
                                    filters: {
                                        // ...this.state.filters,
                                        years: value
                                    }
                                })
                            }}
                            prompt={"出版年"} selectedValue={this.state.years || 'all'}>
                            <Picker.Item label="全部" value="all" />
                            {data.years && data.years.map((e, i) => {
                                return (
                                    <Picker.Item key={'' + i + ''} label={e} value={e} />
                                )
                            })}
                        </Picker>
                    </Block>
                </Block>




                <Block middle padding={[theme.sizes.base / 2, theme.sizes.base * 2]}>
                    <Button
                        gradient
                        onPress={() => { this.setState({ showTerms: false }); }}
                    >
                        <Text1 center white>
                            确定
                  </Text1>
                    </Button>
                </Block>

            </Modal>
        );
    }

    async componentDidMount() {
        // let server = new StaticServer(8080);
        // server.start().then((url) => {
        //     console.log("Serving at URL", url);
        //   });
        // // Start the server
        // const isRunning = await server.isRunning();
    }
    render() {
        const { data } = this.state;

        return (
            <View style={{ paddingTop: StatusBar.currentHeight, flex: 1, backgroundColor: 'white' }}>
                <Block flex={false} row center space="between" style={styles.header}>
                    <Text1 h1 bold>
                        图书馆
                    </Text1>
                    {this.renderSearch()}
                </Block>
                <Button onPress={() => this.setState({ showTerms: true })}>
                    <Text center caption gray>筛选</Text>
                </Button>
          
                {this.renderTermsService()}
                <FlatList
                    onEndReachedThreshold={0.5}
                    onEndReached={() => { this.search(++pageTorender, false) }}
                    style={{ backgroundColor: Colors.light }}
                    data={data.books && data.books}
                    renderItem={this.renderItems}
                    keyExtractor={item => item.id}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            colors={[Colors.purple]}
                            progressBackgroundColor={"#ffffff"}
                            onRefresh={() => { pageTorender = 1; this.search(pageTorender, true) }}
                        />
                    }
                >
                </FlatList>
                {this.renderFooter()}
            </View>
        )
    }
}

export default Library


const Item = (item) => {
    const inputShadowOpt = {
        width: 80,
        height: 120,
        color: theme.colors.black,
        border: 2,
        // radius: 13,
        opacity: 0.1,
        x: 0,
        y: 1,
        style: {
            marginVertical: 5,
            marginHorizontal: 8,
            elevation: 1
        }
    }
    const book = item.book
    return (
        <Block style={{}} color={'white'} center row margin={[1, 0]} padding={[8, 10]}>

            <Image style={{ width: 80, height: 120 }} source={{ uri: `http://202.112.150.126/index.php?client=csu&isbn=${book.ISBN}/cover` }}></Image>

            <Block>
                <Text1 height={25} header style={{ fontFamily: 'Futura' }} numberOfLines={2} >{book.title}</Text1>
                <Text1 height={22} gray body>
                    {book.author || '无作者信息'}
                </Text1>
                <Text1 height={20} gray caption light>出版社：{book.publisher}</Text1>
                <Text1 height={20} gray caption light>出版日期：{book.dates}</Text1>
                <Text1 height={20} gray caption light>ISBN：{book.ISBN}</Text1>
            </Block>
        </Block>
    );
}



const styles = StyleSheet.create({
    header: {
        paddingHorizontal: theme.sizes.base * 2,
        paddingBottom: theme.sizes.base
    },
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    }, search: {
        height: theme.sizes.base * 2,
        width: width - theme.sizes.base * 2
    },
    searchInput: {
        fontSize: theme.sizes.caption,
        height: theme.sizes.base * 2,
        backgroundColor: "rgba(142, 142, 147, 0.06)",
        borderColor: "rgba(142, 142, 147, 0.06)",
        paddingLeft: theme.sizes.base / 1.333,
        paddingRight: theme.sizes.base * 1.5
    },
    searchRight: {
        top: 0,
        marginVertical: 0,
        backgroundColor: "transparent"
    },
    searchIcon: {
        position: "absolute",
        right: theme.sizes.base / 1.333,
        top: theme.sizes.base / 1.6
    },
    footer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        left: 0,
        overflow: "visible",
        alignItems: "center",
        justifyContent: "center",
        height: height * 0.1,
        width,
        paddingBottom: theme.sizes.base * 3.5
    },
    tag: {
        borderColor: theme.colors.gray2,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: theme.sizes.base,
        paddingHorizontal: theme.sizes.base,
        paddingVertical: theme.sizes.base / 2.5,
        marginRight: theme.sizes.base * 0.625
    },
});


