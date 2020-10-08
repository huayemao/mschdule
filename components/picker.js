import React, { PureComponent } from 'react';
import {
  View,
  Picker,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  Alert,

　　Text 
} from 'react-native';

// 默认获取本地时间
const dataObj = new Date();
class PickerData extends PureComponent {
  constructor(props) {
    super(props);
// 默认获取显示本地当前时间
    this.state = {
      datetimeYear: dataObj.getFullYear() + '',
      datetimeMoth: ((dataObj.getMonth() + 1) + '').length <= 1 ?
        ('0' + (dataObj.getMonth() + 1)) : ((dataObj.getMonth() + 1) + ''),
    };
  }
// 生成列表
// start 开始时间
// ender 结束时间

// str 日期单位

  _renderDeal = (start, ender, str) => {
    const dealRow = [];
    for (let i = start; i < ender; i++) {
// 月份碰到小于10的加0,例如07月
      if ((i + '').length <= 1) {
        dealRow.push(
          <Picker.Item label={'0' + i + str} value={'0' + i} key={i} />
        );
      } else {
        dealRow.push(
          <Picker.Item label={i + str} value={'' + i} key={i} />
        );
      }
    }
    return dealRow;
  };

// 格式化日期
// 两位数月份
  dateFormatting = (temp) => {
    const month = (temp.getMonth() + 1) + '';
    if (month.length <= 1) {
      return temp.getFullYear() + '0' + month;
    } else {
      return temp.getFullYear() + '' + month;
    }
  };

// 点击确认回调方法onComfig
  comfig = () => {
    const yeartime = this.dateFormatting(dataObj);
    const yeartimeer = this.state.datetimeYear + this.state.datetimeMoth;
// 用户点错月份  
    if (yeartime < yeartimeer) {
      Alert.alert('错误提示', '当月没有记录，请重新选择日期', [{ text: '确定' }]);
    } else {
// 回调
      this.props.onComfig(yeartimeer);
    }
  };
  render() {
    const { visible } = this.props;

    return (
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => this.props.onRequestClose()}
      >
        <View style={styles.modelSelect}>
          <View style={styles.ViewStyle}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgb(75,139,249)', padding: 20 }}>
              <Text style={{ fontSize: 20, color: '#000' }}>
                {this.state.datetimeYear + '年' + this.state.datetimeMoth + '月'}
              </Text>
            </View>
            <View style={styles.main}>
              <Picker
                prompt={'请选择年份'}
                mode="dialog"
                selectedValue={this.state.datetimeYear}
                onValueChange={(lang) => { this.setState({ datetimeYear: lang }); }}
                style={styles.switchStyle}
              >
                {this._renderDeal(2016, dataObj.getFullYear() + 1, '年')}
              </Picker>
              <Picker
                prompt={'请选择月份'}
                mode="dialog"
                selectedValue={this.state.datetimeMoth}
                onValueChange={(lang) => { this.setState({ datetimeMoth: lang }); }}
                style={styles.switchStyle}
              >
                {this._renderDeal(1, 13, '月')}
              </Picker>
            </View>
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgb(75,139,249)' }}>
              <TouchableOpacity onPress={() => this.props.onCancel()}>
                <View style={[styles.cancelStyle, { borderRightWidth: 1, borderRightColor: 'rgb(75,139,249)' }]}>
                  <Text style={{ fontSize: 16 }}>取消</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { this.comfig(loading); }}
              >
                <View style={styles.cancelStyle}>
                  <Text style={{ fontSize: 16, color: '#000' }}>确认</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    );
  }
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginVertical: 20
  },
  switchStyle: {
    width: 140,

  },
  modelSelect: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  ViewStyle: {
    width: Dimensions.get('window').width - 30,
    alignSelf: 'center',
    height:  240 ,
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 15,
    backgroundColor: '#fff'
  },
  cancelStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: (Dimensions.get('window').width - 30) / 2,
  }
});
export default PickerData;