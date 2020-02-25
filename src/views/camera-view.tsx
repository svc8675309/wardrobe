import CameraRoll from "@react-native-community/cameraroll";
import React, { Component } from "react";
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNCamera, TakePictureResponse } from 'react-native-camera';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, PinchGestureHandlerStateChangeEvent, State } from 'react-native-gesture-handler';
import ImageResizer from 'react-native-image-resizer';
import { NavigationContainerProps, NavigationEventSubscription } from 'react-navigation';
import { smallImageStyle } from '../main-app';
import { Article, ArticleType, hp } from '../shared/article';
import { Constants } from "../shared/constants";
import { SimpleCallback } from "../shared/simple-callback";
import ArticleSelect from './article-select';


interface IState {
	focusedScreen: boolean;
	zoom: number;
	flash: any;
	isTakingImage: boolean
}

export default class CameraView extends Component<NavigationContainerProps, IState> {
	static navigationOptions = {
		swipeEnabled: false,
		tabBarIcon: ({ tintColor, focused }) => (
			<Image source={Constants.open ? require('../../assets/open-resources/camera.png') : require('../../assets/resources/camera.png')} style={smallImageStyle.image} />
		)
	};

	// invoked when this tab gained focus
	didFocusListener: NavigationEventSubscription;
	willfocusListener: NavigationEventSubscription;
	willBlurListener: NavigationEventSubscription;


	ZOOM_F = Platform.OS === 'ios' ? 0.0005 : 0.08;

	camera: React.RefObject<RNCamera>;

	_prevPinch: number;
	articleSelectRef: React.RefObject<ArticleSelect>;

	constructor(props: NavigationContainerProps) {
		super(props);
		this.state = {
			zoom: 0,
			flash: RNCamera.Constants.FlashMode.off,
			focusedScreen: true,
			isTakingImage: false
		};

		this.snap = this.snap.bind(this);
		this.cancel = this.cancel.bind(this);
		this.setZoom = this.setZoom.bind(this);
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
		this.toggleFlash = this.toggleFlash.bind(this);
		this._onPinchGestureEvent = this._onPinchGestureEvent.bind(this);
		this._onPinchHandlerStateChange = this._onPinchHandlerStateChange.bind(this);

		this._prevPinch = 1;
		this.camera = React.createRef<RNCamera>();
		this.articleSelectRef = React.createRef<ArticleSelect>();
	}

	/**
	 * Called from ArticlePager.onAddArticleDlg();
	 */
	componentDidMount() {
		this.didFocusListener = this.props.navigation.addListener('didFocus',
			payload => {
				if (payload.state.params.articleType) {
					// If the user selects the camera tab first 
					const { articleType } = payload.state.params;
					this.articleSelectRef.current.onArticleTypeSelect(articleType);
				} else {
					this.articleSelectRef.current.onArticleTypeSelect(ArticleType.wBottom);
				}
			});
		this.willfocusListener = this.props.navigation.addListener('willFocus',
			() => this.setState({ focusedScreen: true }));

		this.didFocusListener = this.props.navigation.addListener('willBlur',
			() => this.setState({ focusedScreen: false }));
	}

	componentWillUnmount() {
		this.didFocusListener.remove();
		this.willfocusListener.remove();
		this.didFocusListener.remove();
	}
	async snap() {
		if (this.camera && this.camera.current) {
			const options = {
				quality: 0.5,
				base64: true,
				orientation: RNCamera.Constants.Orientation.auto,
				pauseAfterCapture: false,
				fixOrientation: false, // android only
			};
			// required to prevent freeze https://github.com/expo/expo/issues/2288
			setTimeout(() => this.setState({ isTakingImage: true }), 1);

			const data: TakePictureResponse | void = await this.camera.current.takePictureAsync(options)
				.catch((error) => console.log(`CameraView.snap() error : ${error}`));

			this.setState({ isTakingImage: false });

			if (data) {
				let uri: string = data.uri;
				const response = await ImageResizer.createResizedImage(data.uri, 512, 384, "JPEG", 100);
				if (response) {
					uri = response.uri;
				}
				CameraRoll.save(uri, { type: 'photo', album: Constants.wStorageUnitName })
					.then((uri) => {
						const article = new Article(uri, this.articleSelectRef.current.onGetArticleType());
						SimpleCallback.emit(article);
						//this.props.navigation.navigate('Wardrobe');
					}).catch((error) => console.log(`CameraView.snap() cannot add to camera role error : ${error}`));
			} else {
				this.cancel().catch((error) => console.log(`CameraView.snap() cancel error : ${error}`));
			}
		}
	}

	private async cancel() {
		this.props.navigation.navigate('Wardrobe', { article: undefined });
	}

	private setZoom(zoom: number) {
		this.setState(() => {
			return {
				zoom: zoom
			};
		});
	}

	private async zoomIn() {
		let zoom = this.state.zoom + this.ZOOM_F;
		if (zoom > 1) { zoom = 1; }
		this.setZoom(zoom);
	}

	private async zoomOut() {
		let zoom = this.state.zoom - this.ZOOM_F;
		if (zoom < 0) { zoom = 0; }
		this.setZoom(zoom);
	}

	private async toggleFlash() {
		let flash: any;
		if (this.state.flash === RNCamera.Constants.FlashMode.off) {
			flash = RNCamera.Constants.FlashMode.on;
		} else if (this.state.flash === RNCamera.Constants.FlashMode.on) {
			flash = RNCamera.Constants.FlashMode.auto;
		} else {
			flash = RNCamera.Constants.FlashMode.off;
		}

		this.setState(() => {
			return {
				flash: flash
			};
		});
	}

	_onPinchGestureEvent(event: PinchGestureHandlerGestureEvent) {
		const p = event.nativeEvent.scale;
		const p2 = p - this._prevPinch;

		if (p2 > 0 && p2 > this.ZOOM_F) {
			this._prevPinch = p;
			this.setZoom(Math.min(this.state.zoom + this.ZOOM_F, 1));
		} else if (p2 < 0 && p2 < -this.ZOOM_F) {
			this._prevPinch = p;
			this.setZoom(Math.max(this.state.zoom - this.ZOOM_F, 0));
		}
	}

	_onPinchHandlerStateChange(event: PinchGestureHandlerStateChangeEvent) {
		if (event.nativeEvent.state === State.END) {
			this._prevPinch = 1;
		} else if (event.nativeEvent.oldState === State.BEGAN && event.nativeEvent.state === State.ACTIVE) {
			this._prevPinch = 1;
		}
	}

	render() {
		if (this.state.focusedScreen) {
			return (
				<View style={styles.aperture}>
					<View style={styles.topButtonGroup}>
						<ArticleSelect ref={this.articleSelectRef} />
					</View>
					<PinchGestureHandler
						onGestureEvent={this._onPinchGestureEvent}
						onHandlerStateChange={this._onPinchHandlerStateChange}>
						<View collapsable={false}>
							<RNCamera
								ref={this.camera}
								style={styles.camera}
								type={RNCamera.Constants.Type.back}
								flashMode={this.state.flash}
								captureAudio={false}
								zoom={this.state.zoom}
								maxZoom={0}
							/>
						</View>
					</PinchGestureHandler>
					<View style={styles.bottomButtonGroup}>
						<TouchableOpacity onPress={this.cancel} style={{ marginLeft: 10 }}>
							<Image source={Constants.open ? require('../../assets/open-resources/back.png') : require('../../assets/resources/back.png')} style={{ ...smallImageStyle.image, width: 50 }} />
						</TouchableOpacity>
						<TouchableOpacity onPress={this.snap}>
							<View>
								<Image source={Constants.open ? require('../../assets/open-resources/camera.png') : require('../../assets/resources/camera.png')} style={{ ...smallImageStyle.image, width: 50 }} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.toggleFlash} style={{ marginRight: 10 }}>
							{this.getFlash()}
						</TouchableOpacity>
					</View>
				</View>
			);
		} else {
			return (
				<View style={styles.aperture}>
					<View style={styles.topButtonGroup}>
						<ArticleSelect ref={this.articleSelectRef} />
					</View>
					<View />
					<View style={styles.bottomButtonGroup}>
						<TouchableOpacity onPress={this.cancel} style={{ marginLeft: 10 }}>
							<Image source={Constants.open ? require('../../assets/open-resources/back.png') : require('../../assets/resources/back.png')} style={{ ...smallImageStyle.image, width: 50 }} />
						</TouchableOpacity>
						<TouchableOpacity onPress={this.snap}>
							<View>
								<Image source={Constants.open ? require('../../assets/open-resources/camera.png') : require('../../assets/resources/camera.png')} style={{ ...smallImageStyle.image, width: 50 }} />
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.toggleFlash} style={{ marginRight: 10 }}>
							{this.getFlash()}
						</TouchableOpacity>
					</View>
				</View>
			);

		}


	}

	getFlash(): JSX.Element {
		switch (this.state.flash) {
			case RNCamera.Constants.FlashMode.off:
				return <Image source={Constants.open ? require('../../assets/open-resources/flash-off.png') : require('../../assets/resources/flash-off.png')} style={{ ...smallImageStyle.image, width: 50 }} />
			case RNCamera.Constants.FlashMode.auto:
				return <Image source={Constants.open ? require('../../assets/open-resources/auto-flash.png') : require('../../assets/resources/auto-flash.png')} style={{ ...smallImageStyle.image, width: 50 }} />
			default:
				return <Image source={Constants.open ? require('../../assets/open-resources/flash.png') : require('../../assets/resources/flash.png')} style={{ ...smallImageStyle.image, width: 50 }} />
		}
	}


}

const styles = StyleSheet.create({
	aperture: {
		flexDirection: 'column',
		justifyContent: 'center',
		backgroundColor: 'white'
	},
	camera: Platform.select({
		ios: { height: hp(65), },
		android: { height: hp(52) }

	}),
	bottomButtonGroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10
	},
	topButtonGroup: Platform.select({
		ios: {
			flexDirection: 'row',
			marginBottom: 10
		},
		android: {
			flexDirection: 'row',
			marginBottom: hp(16)
		}
	})
});
