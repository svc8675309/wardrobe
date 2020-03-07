# `Wardrobe App`

`Version 1.0.0`

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)

![wLogo](/assets/open-resources/wardrobe-app-sm.png)

## What is it

A clothing management tool allowing users to

* Peruse your wardrobe from a mobil device.
* Snap pics to see how an item might work with what you have.
* The embedded camera takes "small" pictures ( ~50K ) to minimize space.
* Wardrobe uses an album named "Wardrobe Storage Unit" allowing new clothing items to be managed / or shared.

![example](wardrobe-anamated.gif)

## Privacy Policy

    Wardrobe creates an album on your device named "Wardrobe Storage Unit".
    It is initially populated with some of my apperal items for demonstration purposes.
    No data leaves your Device. All pictures take are stored in your gallery under the aforementioned album.
    The only other data kept are your own apperal item assignments. This data is stored on your device.
    No personal data beyond pics of clothing articles are asked for.
    Wardrobe does not access wireless.
    It needs access to your camera and local storage for the reasons mentioned above.

## Images / Icons

    To keep this repo public I had to gitignore my licensed ( www.flaticon.com ) images. 
    
    So when you see code like, "...  Constants.open ?  require('../../assets/open-resources ..."

    I'm replacing opensource icons ( font-awesome ) in this repo with the licensed ones stored locally on my box. 

## Usage

![wCa](/assets/open-resources/wardrobe-sm.png)

* Wardrobe Tab: Used to peruse your clothing arrangements. Articles may be rated and managed.

![wCa](/assets/open-resources/camera-sm.png)

* Camera Tab: Specify the type of apparel to take a picture of and it will automatically appear in the wardrobe.

![wSu](/assets/open-resources/storage-unit-sm.png)

* Wardrobe Storage Unit Tab : Articles to be hung up in your wardrobe are kept in the Wardrobe Storage Unit, a photo album. Articles are placed in your wardrobe by identifying them as either: a top, bottom, or shoe. The empty hanger option removes articles from the wardrobe. The storage unit manages the contents fo the wardrobe.

![wSe](/assets/open-resources/settings-sm.png)

* Clear the wardrobe.
* My info and credits to open source repos used to construct this app.

## Build

I built this project with the following versions of software installed. 
* node.js v10.15.3
* npm 6.4.1
* yarn v1.19.2
* react-native 0.61.5

To build
* yarn install
* yarn ios  / yarn andorid

Note: This was my first react-native app... A review of the App Store, after the fact, yeilded that others have done this same kind of thing ( I should have checked first ). Nevertheless, maybe some of this code will help someone else. :-)

