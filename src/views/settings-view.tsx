import React, { Component } from "react";
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AnimatedModal from 'react-native-modal';
import SettingsList from 'react-native-settings-list';
import { smallImageStyle } from "../main-app";
import { hp } from "../shared/article";
import { Constants } from "../shared/constants";
import { WStorageCache } from "../shared/w-storage-cache";

interface IState { isVisable: boolean };

export default class SettingsView extends Component<any, IState> {
  static navigationOptions = {
    swipeEnabled: false,
    tabBarIcon: ({ tintColor, focused }) => (
      <Image source={ Constants.open ?  require('../../assets/open-resources/settings.png') :require('../../assets/resources/settings.png')} style={smallImageStyle.image} />
    )
  };

  constructor(props: any) {
    super(props);

    this.state = { isVisable: false };
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.setState({ isVisable: false });
  }

  render() {
    return (
      <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
        <View style={{ backgroundColor: '#EFEFF4', flex: 1 }}>
          <SettingsList borderColor='#c8c7cc' defaultItemSize={50}>
            <SettingsList.Header headerStyle={{ marginTop: 15 }} />
            <SettingsList.Item
              titleStyle={styles.bText}
              icon={<Image source={ Constants.open ?  require('../../assets/open-resources/hanger_off.png') :require('../../assets/resources/hanger_off.png')} style={smallImageStyle.image} />}
              hasSwitch={true}
              switchState={false}
              hasNavArrow={false}
              switchOnValueChange={() => {
                Alert.alert('Cleared');
                WStorageCache.clearArticles();
              }}
              title='Clear Article Selections'
            />
            <SettingsList.Item
              titleStyle={styles.bText}
              icon={<Image source={ Constants.open ?  require('../../assets/open-resources/open-source.png') :require('../../assets/resources/open-source.png')} style={smallImageStyle.image} />}
              hasNavArrow={true}
              title='Credits'
              onPress={() => { this.setState({ isVisable: true }) }}
            />
          </SettingsList>
          <AnimatedModal backdropOpacity={0.3}
              style={styles.modal}
              isVisible={this.state.isVisable}
              animationIn={Platform.OS === "ios" ? IOS_MODAL_ANIMATION : "zoomIn"}
              animationOut={"fadeOut"}>
              <View style={styles.content}>
                <Image source={ Constants.open ?  require('../../assets/open-resources/svc.jpg') :require('../../assets/resources/svc.jpg')} style={{resizeMode: 'contain'}} />
                <Text style={styles.bText}>{me}</Text>
                <ScrollView style={styles.openSoruceStyle}>
                  <Text style={styles.bText}>{textBody}</Text>
                </ScrollView>
                <TouchableOpacity style={{paddingTop: 10}} onPress={() => { this.closeModal() }} >
                  <Image source={ Constants.open ?  require('../../assets/open-resources/check.png') :require('../../assets/resources/check.png')} style={smallImageStyle.image} />
                </TouchableOpacity>
              </View>
            </AnimatedModal>
        </View>
      </View>
    );
  }
}
const IOS_MODAL_ANIMATION = {
  from: { opacity: 0, scale: 1.2 },
  0.5: { opacity: 1 },
  to: { opacity: 1, scale: 1 }
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  content: {
    flexDirection: "column",
    padding: 16,
    margin: 16,
    borderRadius: 13,
    height:hp(85),
    backgroundColor: "white",
    overflow: "hidden"
  },
  openSoruceStyle: {
    borderColor: '#6593F5',
    borderWidth: 2,
    borderRadius: 10,
  },
  bText: Platform.select({
		ios: {
      fontFamily: 'Arial',
      fontSize: 4
		},
		android: {
      fontFamily: 'Arial',
      fontSize: 12
		}
	})
});

const me = `
Copyright (c) 2020, Scott Van Camp
https://github.com/svc8675309/wardrobe

All the cool open source contributors
`;

const textBody = `
Copyright (c) Facebook, Inc. and its affiliates.
https://github.com/facebook/react

Copyright (c) Facebook, Inc. and its affiliates.
https://github.com/facebook/react-native

Copyright (c) 2017, Archriss
https://github.com/archriss/react-native-snap-carousel

Copyright (c) 2015-present, Facebook, Inc.
https://github.com/react-native-community/async-storage

Copyright (c) 2015 Loch Wansbrough
https://github.com/react-native-community/react-native-camera

Copyright (c) 2015 Johannes Lumpe
https://github.com/itinance/react-native-fs

Copyright (c) 2016 Krzysztof Magiera
https://github.com/software-mansion/react-native-gesture-handler

Copyright (c) 2016- Nick Baugh <niftylettuce@gmail.com> (http://niftylettuce.com/)
https://github.com/joinspontaneous/react-native-loading-spinner-overlay

Copyright (c) 2017 React Native Community
https://github.com/react-native-community/react-native-modal

Copyright (c) 2016 Monte Thakkar
https://github.com/Monte9/react-native-ratings

Copyright (c) 2016 Krzysztof Magiera
https://github.com/software-mansion/react-native-reanimated

Copyright (c) 2016 
https://github.com/evetstech/react-native-settings-list

Copyright (c) 2017 React Native Community
https://github.com/hilkeheremans/react-navigation-tabs

License CC 3.0 BY.
https://www.flaticon.com/packs/font-awesome

Copyright (c) 2015 Florian Rival and Alexandre Moureaux
https://github.com/bamlab/react-native-image-resizer
`;
