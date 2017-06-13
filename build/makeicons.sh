#!/bin/bash

convert icon.png -resize 16x16 -depth 32 PNG32:icons/16x16.png[32]
convert icon.png -resize 32x32 icons/32x32.png
convert icon.png -resize 128x128 icons/128x128.png
convert icon.png -resize 256x256 icons/256x256.png
png2icns icon.icns icons/*
