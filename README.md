# `Wardrobe App`

`Version 1.0.0`

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square&colorB=191A17)

![wLogo](/assets/open-resources/wardrobe-app-sm.png)

## What is it

A clothing management tool allowing users to

* Peruse articles of apparel from a mobil device.
* Snap pics to see how an item might work with what you have.
* Share clothing via your mobil gallery.

![example](wardrobe-anamated.gif)

## Security

    Wardrobe does not access wireless. Clothing pics are either: imported by copying them to an album named 
    ( Wardrobe Storage Unit ), created when this app is first launched, or by using the included camera. 
    All state including article selections, ratings, and album contents are stored locally.

## Images / Icons

    To keep this repo public I had to gitignore my licensed ( www.flaticon.com ) images. So when you see code like
    
    ...  Constants.open ?  require('../../assets/open-resources ...

    Basically I provide some font-awesome and custom images for opensource, then change the setting locally to use my "Store bought" 
    local resources image dir for distribution.

## Usage

![wCa](/assets/open-resources/wardrobe-sm.png)

* Wardrobe Tab: Used to peruse your clothing arrangements. Articles may be rated and managed.

![wCa](/assets/open-resources/camera-sm.png)

* Camera Tab: Specify the type of apparel to take a picture of and it will automatically appear in the wardrobe.

![wSu](/assets/open-resources/storage-unit-sm.png)

* Wardrobe Storage Unit Tab : Articles to be hung up in your wardrobe are kept in the Wardrobe Storage Unit, a photo album. Articles are placed in your wardrobe by identifying them as either: a top, bottom, or shoe. The empty hanger option removes articles from the wardrobe. The storage unit manages the contents fo the wardrobe.

![wSe](/assets/open-resources/settings-sm.png)

* Clear the wardrobe.
* My info and credits to open source modules used to construct this app.
