package service

import "errors"

var ErrTagNotFound = errors.New("tag not found")
var ErrTagAlreadyExists = errors.New("tag already exists")
