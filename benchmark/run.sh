#!/bin/bash

cwd=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

node $cwd/index.js | tee $cwd/plot.dat.0
gnuplot $cwd/plot.dem
