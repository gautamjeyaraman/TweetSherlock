#!/usr/bin/env python
from twisted.scripts import twistd
import sys
import os
cur_dir = os.path.abspath(os.path.dirname(__file__))
par_dir = os.path.normpath(os.path.join(cur_dir, os.pardir))
sys.path.append(par_dir)

from cyclone_server import autoreload

sys.argv = [__file__, '-n', 'cyclone_server', '-l', '0.0.0.0']
autoreload.main(twistd.run)
