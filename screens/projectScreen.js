import React from "react";
import styled from "styled-components";
import Project from "../components/Project";
import { PanResponder, Animated, StatusBar, Dimensions, View } from "react-native";
import Tempserivce from "../services/tempService";
import Loading, { Flower } from '../components/loading';

const screenWidth = Dimensions.get('window').width



export default class ProjectsScreen extends React.Component {

    getNextIndex(index) {
        var nextIndex = index + 1;
        if (nextIndex > this.state.data.length - 1) {
            return 0;
        }
        return nextIndex;
    }
    getPrevIndex(index) {
        var nextIndex = index - 1;
        if (nextIndex < 0) {
            return this.state.data.length - 1;
        }
        return nextIndex;
    }

    componentDidMount() {
        Tempserivce.getText().then(res => {
            console.log(res.data)
            this.setState({ data: res.data })
        })
    }

    static navigationOptions = {
        header: null
    };

    state = {
        pan: new Animated.ValueXY(),
        scale: new Animated.Value(0.9),
        translateY: new Animated.Value(44),
        thirdScale: new Animated.Value(0.8),
        thirdTranslateY: new Animated.Value(-50),
        index: 0,
        opacity: new Animated.Value(0),
        opened: false,
        flag: 0b000,//第一位表示方向，后一位表示是否在移动中，最后一位表示中立,
        data: null,
        canbeOpened: false

    };

    _panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (event, gestureState) => {
            if (gestureState.dx === 0 && gestureState.dy === 0 || this.state.opened) {
                return false;
            } else {
                return true;
            }
        },

        onPanResponderGrant: () => {
            // this.setState({flag1:1});
            this.setState((prevState) => ({
                flag: prevState.flag | 0b011
            }));

            Animated.spring(this.state.scale, { toValue: 1 }).start();
            Animated.spring(this.state.translateY, { toValue: 0 }).start();

            Animated.spring(this.state.thirdScale, { toValue: 0.9 }).start();
            Animated.spring(this.state.thirdTranslateY, { toValue: 44 }).start();

            Animated.timing(this.state.opacity, { toValue: 1 }).start();
        },

        onPanResponderMove: Animated.event([
            null,
            { dx: this.state.pan.x, dy: this.state.pan.y }
        ],
            {
                listener: (event, gestureState) => {

                    if (gestureState.dx > 0 && (this.state.flag != 0b110)) {
                        this.setState({ flag: 0b110 })
                        // this.setState((prevState) => ({
                        //     flag: (~prevState.flag | 0b01) 
                        //   }));                     
                    }
                    if (gestureState.dx < 0 && (this.state.flag != 0b010)) {
                        this.setState({ flag: 0b010 })
                    }

                }
            }
        ),

        onPanResponderRelease: () => {
            const positionY = this.state.pan.x.__getValue();
            Animated.timing(this.state.opacity, { toValue: 0 }).start();
            // console.log(positionY);

            if (positionY > 100) {


                Animated.timing(this.state.pan, {
                    toValue: { x: screenWidth, y: 0 }, duration: 150
                }).start(() => {
                    this.setState({ flag: 0b101 })
                    this.setState({ index: this.getNextIndex(this.state.index) });
                    this.state.pan.setValue({ x: 0, y: 0 });
                    this.state.scale.setValue(0.9);
                    this.state.translateY.setValue(44);
                    this.state.thirdScale.setValue(0.8);
                    this.state.thirdTranslateY.setValue(-50);

                });


            }
            else if (positionY < -100) {

                Animated.timing(this.state.pan, {
                    toValue: { x: -screenWidth, y: 0 }, duration: 150
                }).start(() => {
                    this.setState({ flag: 0b001 })
                    this.setState({ index: this.getPrevIndex(this.state.index) });
                    this.state.pan.setValue({ x: 0, y: 0 });
                    this.state.scale.setValue(0.9);
                    this.state.translateY.setValue(44);
                    this.state.thirdScale.setValue(0.8);
                    this.state.thirdTranslateY.setValue(-50);
                });


            }
            else {
                Animated.spring(this.state.pan, {
                    toValue: { x: 0, y: 0 }
                }).start();

                Animated.spring(this.state.scale, { toValue: 0.9 }).start();
                Animated.spring(this.state.translateY, { toValue: 44 }).start();

                Animated.spring(this.state.thirdScale, { toValue: 0.8 }).start();
                Animated.spring(this.state.thirdTranslateY, { toValue: -50 }).start();
                this.setState((prevState) => ({
                    flag: prevState.flag & 0b101
                }));
            }
        }
    });


    render() {
        // console.log(JSON.stringify(this.state.data));
        // console.log(screenWidth)
        // console.log(this.state.pan.x.__getValue())
        //    if(this.state.data)
        return (
            <Container>
                {
                    (!this.state.canbeOpened || !this.state.data) && <Flower start={()=>this.setState({canbeOpened:true})}></Flower>
                }

        
                {this.state.data &&
                    <>
                        <AnimatedMask style={{ opacity: this.state.opacity }} />
                        <Animated.View
                            style={{
                                transform: [
                                    { translateX: this.state.pan.x },
                                    { translateY: this.state.pan.y }
                                ]
                            }}
                            {...this._panResponder.panHandlers}
                        >
                            <Project
                                title={this.state.data[this.state.index].title}
                                image={this.state.data[this.state.index].image}
                                author={this.state.data[this.state.index].author}
                                text={this.state.data[this.state.index].text}
                                canOpen={true}
                                openCard={() => { this.setState({ opened: true }) }}
                                closeCard={() => this.setState({ opened: false })}
                            />
                        </Animated.View>
                        <Animated.View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: this.state.flag == 0b010 ? 1 : -1,
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    { scale: this.state.scale },
                                    { translateY: this.state.translateY },
                                    // { translateX: this.state.translateX }
                                ]
                            }}
                        >
                            <Project
                                title={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index)].title : this.state.data[this.getPrevIndex(this.state.index)].title}
                                image={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index)].image : this.state.data[this.getPrevIndex(this.state.index)].image}
                                author={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index)].author : this.state.data[this.getPrevIndex(this.state.index)].author}
                                text={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index)].text : this.state.data[this.getPrevIndex(this.state.index)].text}
                            />
                        </Animated.View>
                        <Animated.View
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: -3,
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [
                                    { scale: this.state.thirdScale },
                                    { translateY: this.state.thirdTranslateY }
                                ]
                            }}
                        >
                            <Project
                                title={this.state.flag != 0b010 ? this.state.data[this.getNextIndex(this.state.index + 1)].title : this.state.data[this.getPrevIndex(this.state.index + 1)].title}
                                image={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index + 1)].image : this.state.data[this.getPrevIndex(this.state.index + 1)].image}
                                author={this.state.flag != 0b010 && this.state.flag != 0b001 ? this.state.data[this.getNextIndex(this.state.index + 1)].author : this.state.data[this.getPrevIndex(this.state.index + 1)].author}
                                text={this.state.flag != 0b010 ? this.state.data[this.getNextIndex(this.state.index + 1)].text : this.state.data[this.getPrevIndex(this.state.index + 1)].text}
                            />
                        </Animated.View>
                    </>
                }
            </Container>
        )
    }
}



const Mask = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  z-index: -3;
`;

const AnimatedMask = Animated.createAnimatedComponent(Mask);

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #f0f3f5;
`;

const Text = styled.Text``;

