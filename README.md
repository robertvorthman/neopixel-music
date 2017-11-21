# neopixel-lights
Node script designed for a Raspberry Pi to run a Christmas light show sync'd to MIDI music files.
[Video](https://www.youtube.com/watch?v=jAAgjaXRgyM)

![demo](https://user-images.githubusercontent.com/4665046/33051288-365887d2-ce37-11e7-8319-24bb148a004b.gif)

## USB Audio Card
Make a Raspberry Pi USB audio card the default audio device by editing ```/usr/share/alsa/alsa.conf```

change
```
defaults.ctl.card 0
defaults.pcm.card 0
```
to
```
defaults.ctl.card 1
defaults.pcm.card 1
```