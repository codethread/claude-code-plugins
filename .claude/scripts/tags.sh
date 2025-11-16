#!/bin/bash

git tag -l '*-v*' --format='%(refname:short) -> %(objectname:short) %(subject)' | sort
