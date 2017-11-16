Had to edit 
/usr/share/alsa/alsa.conf
changed
defaults.ctl.card 0
defaults.pcm.card 0
to
defaults.ctl.card 1
defaults.pcm.card 1

for pi and sudo user to default to USB audio card